import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";

initializeApp();
const db = getFirestore();

function requireAuth(requestAuth: any) {
  if (!requestAuth) throw new HttpsError("unauthenticated", "Authentication required.");
  return requestAuth;
}

function isOwnerOrAdmin(auth: any) {
  const email = auth?.token?.email as string | undefined;
  const role = auth?.token?.role as string | undefined;
  return email === "donholmes805@gmail.com" || role === "owner" || role === "admin";
}

function isChannelOwnerOrBetter(auth: any) {
  const email = auth?.token?.email as string | undefined;
  const role = auth?.token?.role as string | undefined;
  return email === "donholmes805@gmail.com" || role === "owner" || role === "admin" || role === "channel_owner";
}

function env(name: string) {
  return process.env[name] || "";
}

// ---------------------------
// Cloudflare Stream (Live)
// ---------------------------

export const cloudflareCreateLiveInput = onCall(async (req) => {
  const auth = requireAuth(req.auth);
  if (!isChannelOwnerOrBetter(auth)) throw new HttpsError("permission-denied", "Insufficient role.");

  const accountId = env("CLOUDFLARE_ACCOUNT_ID");
  const token = env("CLOUDFLARE_STREAM_API_TOKEN");
  if (!accountId || !token) {
    throw new HttpsError("failed-precondition", "Cloudflare Stream is not configured.");
  }

  const { channelId, title, description, scheduledStart, scheduledEnd } = (req.data ?? {}) as any;
  if (!channelId || !title) throw new HttpsError("invalid-argument", "channelId and title are required.");

  // Verify channel ownership (email-based ownership in this project)
  const channelSnap = await db.collection("channels").doc(channelId).get();
  if (!channelSnap.exists) throw new HttpsError("not-found", "Channel not found.");
  const channel = channelSnap.data() as any;
  const email = auth.token.email as string | undefined;
  if (!isOwnerOrAdmin(auth) && channel.ownerId !== email) {
    throw new HttpsError("permission-denied", "You can only create live inputs for your channel.");
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meta: { name: title },
      recording: { mode: "off" },
    }),
  });

  const data = (await response.json()) as any;
  if (!response.ok || !data?.success) {
    throw new HttpsError("internal", "Cloudflare API error.", { cloudflare: data });
  }

  const result = data.result;
  const liveEventRef = db.collection("liveEvents").doc();
  const now = Timestamp.now();
  // Public-safe fields only in liveEvents (no ingestUrl/streamKey)
  await liveEventRef.set({
    id: liveEventRef.id,
    channelId,
    ownerId: channel.ownerId,
    title,
    description: description || "",
    provider: "cloudflare_stream",
    playbackUrl: "",
    playbackId: result.uid || "",
    status: "scheduled",
    scheduledStart: scheduledStart ? Timestamp.fromDate(new Date(scheduledStart)) : null,
    scheduledEnd: scheduledEnd ? Timestamp.fromDate(new Date(scheduledEnd)) : null,
    createdAt: now,
    updatedAt: now,
  });

  // Private ingest credentials in subcollection (restricted by rules)
  await liveEventRef.collection("private").doc("ingest").set({
    ingestUrl: result.rtmps?.url || "",
    streamKey: result.rtmps?.streamKey || "",
    createdAt: now,
    updatedAt: now,
  });

  return { liveEventId: liveEventRef.id };
});

export const cloudflareDisableLiveInput = onCall(async (req) => {
  const auth = requireAuth(req.auth);
  if (!isChannelOwnerOrBetter(auth)) throw new HttpsError("permission-denied", "Insufficient role.");

  const accountId = env("CLOUDFLARE_ACCOUNT_ID");
  const token = env("CLOUDFLARE_STREAM_API_TOKEN");
  if (!accountId || !token) {
    throw new HttpsError("failed-precondition", "Cloudflare Stream is not configured.");
  }

  const { liveEventId } = (req.data ?? {}) as any;
  if (!liveEventId) throw new HttpsError("invalid-argument", "liveEventId is required.");

  const snap = await db.collection("liveEvents").doc(liveEventId).get();
  if (!snap.exists) throw new HttpsError("not-found", "Live event not found.");
  const evt = snap.data() as any;

  // Only Owner/Admin can disable another channel's event
  const email = auth.token.email as string | undefined;
  if (!isOwnerOrAdmin(auth) && evt.ownerId !== email) {
    throw new HttpsError("permission-denied", "You can only disable your own live events.");
  }

  if (evt.playbackId) {
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs/${evt.playbackId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }

  await snap.ref.update({ status: "disabled", updatedAt: Timestamp.now() });
  return { ok: true };
});

// ---------------------------
// Stripe Checkout
// ---------------------------

function stripe() {
  const key = env("STRIPE_SECRET_KEY");
  if (!key) throw new HttpsError("failed-precondition", "Stripe is not configured.");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

export const stripeCreateChannelPlanCheckout = onCall(async (req) => {
  const auth = requireAuth(req.auth);
  if (!isChannelOwnerOrBetter(auth)) throw new HttpsError("permission-denied", "Insufficient role.");

  const { planType, successUrl, cancelUrl, channelId } = (req.data ?? {}) as any;
  if (!planType || !successUrl || !cancelUrl) throw new HttpsError("invalid-argument", "planType, successUrl, cancelUrl required.");

  let adminFeePriceId = "";
  let monthlyPriceId = "";

  if (planType === "starter") {
    adminFeePriceId = env("NEXT_PUBLIC_STRIPE_CHANNEL_STARTER_ADMIN_FEE_PRICE_ID");
    monthlyPriceId = env("NEXT_PUBLIC_STRIPE_CHANNEL_STARTER_MONTHLY_PRICE_ID");
  } else if (planType === "growth") {
    adminFeePriceId = env("NEXT_PUBLIC_STRIPE_CHANNEL_GROWTH_ADMIN_FEE_PRICE_ID");
    monthlyPriceId = env("NEXT_PUBLIC_STRIPE_CHANNEL_GROWTH_MONTHLY_PRICE_ID");
  } else if (planType === "network_partner") {
    adminFeePriceId = env("NEXT_PUBLIC_STRIPE_CHANNEL_PARTNER_ADMIN_FEE_PRICE_ID");
    monthlyPriceId = env("NEXT_PUBLIC_STRIPE_CHANNEL_PARTNER_MONTHLY_PRICE_ID");
  } else {
    throw new HttpsError("invalid-argument", "Invalid planType.");
  }

  if (!adminFeePriceId || !monthlyPriceId) {
    throw new HttpsError("failed-precondition", `Stripe Price IDs for ${planType} are not configured.`);
  }

  const s = stripe();
  const email = auth.token.email as string;
  const userId = auth.uid;

  const session = await s.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      { price: adminFeePriceId, quantity: 1 }, // One-time admin fee (as a line item in subscription)
      { price: monthlyPriceId, quantity: 1 },  // Monthly recurring
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    allow_promotion_codes: true,
    metadata: { 
      type: "channel_plan", 
      productType: "channel_plan",
      planType,
      email,
      userId,
      channelId: channelId || "",
      adminFeeNonRefundable: "true"
    },
  });

  return { url: session.url, id: session.id };
});

export const stripeCreateViewerMembershipCheckout = onCall(async (req) => {
  const auth = requireAuth(req.auth);
  const { membershipType, successUrl, cancelUrl } = (req.data ?? {}) as any;
  if (!membershipType || !successUrl || !cancelUrl) throw new HttpsError("invalid-argument", "membershipType, successUrl, cancelUrl required.");

  let priceId = "";
  let familyProfileLimit = 1;

  if (membershipType === "basic") {
    priceId = env("NEXT_PUBLIC_STRIPE_VIEWER_BASIC_PRICE_ID");
  } else if (membershipType === "premium") {
    priceId = env("NEXT_PUBLIC_STRIPE_VIEWER_PREMIUM_PRICE_ID");
  } else if (membershipType === "family") {
    priceId = env("NEXT_PUBLIC_STRIPE_VIEWER_FAMILY_PRICE_ID");
    familyProfileLimit = 3;
  } else {
    throw new HttpsError("invalid-argument", "Invalid membershipType.");
  }

  if (!priceId) throw new HttpsError("failed-precondition", `Stripe Price ID for ${membershipType} is not configured.`);

  const s = stripe();
  const email = auth.token.email as string;
  const userId = auth.uid;

  const session = await s.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    allow_promotion_codes: true,
    metadata: {
      type: "viewer_membership",
      productType: "viewer_membership",
      membershipType,
      email,
      userId,
      familyProfileLimit: familyProfileLimit.toString()
    },
  });

  return { url: session.url, id: session.id };
});


export const stripeCreateAdCheckout = onCall(async (req) => {
  // Advertisers may be unauthenticated; accept email + advertiserName
  const { priceId, successUrl, cancelUrl, advertiserName, email, channelId, packageType } = (req.data ?? {}) as any;
  if (!priceId || !successUrl || !cancelUrl || !advertiserName || !email || !packageType) {
    throw new HttpsError("invalid-argument", "priceId, successUrl, cancelUrl, advertiserName, email, packageType required.");
  }

  const s = stripe();
  const orderRef = db.collection("adOrders").doc();
  await orderRef.set({
    id: orderRef.id,
    advertiserName,
    email,
    packageType,
    channelId: channelId || null,
    amount: 0,
    status: "pending",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  const session = await s.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    allow_promotion_codes: true,
    metadata: {
      type: "ad_package",
      productType: "ad_package",
      adOrderId: orderRef.id,
      advertiserName,
      email,
      packageType,
      channelId: channelId || "",
    },
  });


  await orderRef.update({ stripeCheckoutSessionId: session.id, updatedAt: Timestamp.now() });
  return { url: session.url, id: session.id, adOrderId: orderRef.id };
});

export const stripeWebhook = onRequest(async (req, res) => {
  const webhookSecret = env("STRIPE_WEBHOOK_SECRET");
  const key = env("STRIPE_SECRET_KEY");
  if (!webhookSecret || !key) {
    res.status(400).send("Stripe not configured.");
    return;
  }

  const s = new Stripe(key, { apiVersion: "2024-06-20" });
  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    res.status(400).send("Missing signature.");
    return;
  }

  let event: Stripe.Event;
  try {
    // Firebase Functions v2 onRequest gives raw body via req.rawBody
    event = s.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Minimal webhook wiring: store subscription status on users by email (owner bypass handled client-side)
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || session.customer_email;
      const meta = session.metadata || {};
      
      await db.collection("stripeEvents").doc(event.id).set({ id: event.id, type: event.type, created: event.created, sessionId: session.id }, { merge: true });

      if (meta.productType === "viewer_membership" && email) {
        await db.collection("billingByEmail").doc(email).set(
          {
            email,
            productType: "viewer_membership",
            membershipType: meta.membershipType,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            membershipStatus: "active",
            familyProfileLimit: parseInt(meta.familyProfileLimit || "1"),
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );
      }

      if (meta.productType === "channel_plan" && email) {
        const planType = meta.planType;
        let revenueSplit = 0.6;
        if (planType === "growth") revenueSplit = 0.65;
        if (planType === "network_partner") revenueSplit = 0.7;

        await db.collection("billingByEmail").doc(email).set(
          {
            email,
            productType: "channel_plan",
            channelPlan: planType,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            channelSubscriptionStatus: "active",
            adminFeePaid: true,
            adminFeeNonRefundable: true,
            revenueSplit,
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );
      }

      if (meta.productType === "ad_package" && meta.adOrderId) {
        const orderRef = db.collection("adOrders").doc(meta.adOrderId);
        await orderRef.set(
          {
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            status: "paid",
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        );

        const gross = (session.amount_total ?? 0) / 100;
        const platformShare = Math.round(gross * 0.4 * 100) / 100;
        const channelOwnerShare = Math.round((gross - platformShare) * 100) / 100;
        const ledgerRef = db.collection("revenueLedger").doc();
        await ledgerRef.set({
          id: ledgerRef.id,
          slug: `adorder-${meta.adOrderId}`,
          channelId: meta.channelId || null,
          ownerId: "donholmes805@gmail.com",
          source: "ad",
          sourceId: meta.adOrderId,
          grossAmount: gross,
          platformShare,
          channelOwnerShare,
          status: "cleared",
          periodStart: Timestamp.now(),
          periodEnd: Timestamp.now(),
          createdAt: Timestamp.now(),
        });
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const email = sub.metadata?.email;
      if (email) {
        await db.collection("billingByEmail").doc(email).set({
          subscriptionStatus: sub.status,
          updatedAt: Timestamp.now(),
        }, { merge: true });
      }
    }

    res.json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(500).send("Webhook handler error.");
  }
});
