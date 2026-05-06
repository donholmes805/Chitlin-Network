# Chitlin Network TV - Deployment Checklist

Follow these steps to transition from local development to production live deployment.

## 1. Firebase Project Setup
- [ ] Create a production Firebase Project at [console.firebase.google.com](https://console.firebase.google.com).
- [ ] Enable **Google Analytics** (optional but recommended).
- [ ] Enable **Authentication**:
  - [ ] Enable Google Sign-In.
  - [ ] Set `oAuthBrandDisplayName` to "Chitlin' Network TV".
  - [ ] Set Support Email to `donholmes805@gmail.com`.
- [ ] Enable **Cloud Firestore** in production mode.
  - [ ] Deploy security rules (`firebase deploy --only firestore:rules`).
  - [ ] Deploy indexes (`firebase deploy --only firestore:indexes`).
- [ ] Enable **Firebase App Hosting** or **Hosting**:
  - [ ] If using App Hosting, connect your GitHub repository.
  - [ ] If using standard Hosting, ensure `npm run build` (static export) works and `firebase deploy --only hosting`.

## 2. Environment Configuration
### Frontend (.env)
Set these in your hosting environment (e.g., App Hosting secrets or locally for build):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_CHANNEL_STARTER_ADMIN_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_CHANNEL_STARTER_SUBSCRIPTION_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_CHANNEL_GROWTH_ADMIN_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_CHANNEL_GROWTH_SUBSCRIPTION_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_CHANNEL_PARTNER_ADMIN_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_CHANNEL_PARTNER_SUBSCRIPTION_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_MEMBERSHIP_BASIC_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_MEMBERSHIP_PREMIUM_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_MEMBERSHIP_FAMILY_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_AD_BASIC_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_AD_FEATURED_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_AD_SPONSORED_PRICE_ID`

### Firebase Functions Secrets
Set these using `firebase functions:secrets:set`:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STREAM_API_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 3. Stripe Integration
- [ ] Create **12 products** in Stripe Dashboard.
  - [ ] 3 Channel Admin Fees (One-time)
  - [ ] 3 Channel Monthly Subscriptions
  - [ ] 3 Viewer Membership Subscriptions (with 14-day trials)
  - [ ] 3 Ad Package One-time purchases
- [ ] Copy all 12 Price IDs to the frontend environment variables.
- [ ] Set up a Webhook endpoint pointing to `https://<region>-<project-id>.cloudfunctions.net/stripeWebhook`.
- [ ] Enable `checkout.session.completed` event.
- [ ] Copy the Webhook Signing Secret to `STRIPE_WEBHOOK_SECRET`.

## 4. Cloudflare Integration
- [ ] Create a Cloudflare account and enable **Stream**.
- [ ] Generate an **API Token** with `Stream: Edit` permissions.
- [ ] Copy the **Account ID** and **Token** to Functions secrets.

## 5. Deployment Sequence
1.  **Build Frontend**: `npm run build`
2.  **Deploy Rules/Indexes**: `firebase deploy --only firestore`
3.  **Deploy Functions**: `firebase deploy --only functions`
4.  **Deploy Hosting**: `firebase deploy --only hosting`
5.  **Initialize Data**: Sign in as `donholmes805@gmail.com` and run the **Genesis Seed** from the `/admin` dashboard.

## 6. Real-World Integration Tests
### OBS Live Test
- [ ] Sign in as Owner.
- [ ] Navigate to `/owner/live`.
- [ ] Create a "Production Test" event (Ensure you have a Growth or Partner plan).
- [ ] Configure OBS with the provided RTMPS URL and Stream Key.
- [ ] Start streaming in OBS.
- [ ] Confirm video appears on `/watch-live`.

### Billing Test
- [ ] Attempt to "Start a Channel" at `/start-a-channel`.
- [ ] Attempt to become a Member at `/membership`.
- [ ] Confirm redirect to Stripe Checkout and valid plan metadata.

### Admin Smoke Test
- [ ] Visit `/admin/system-check` to confirm all 12 Price IDs are active.
- [ ] Review `/admin/revenue` to ensure ledger entries appear after test purchases.
