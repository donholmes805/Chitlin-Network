import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/config";

export const callables = {
  cloudflareCreateLiveInput: httpsCallable(functions, "cloudflareCreateLiveInput"),
  cloudflareDisableLiveInput: httpsCallable(functions, "cloudflareDisableLiveInput"),
  stripeCreateChannelPlanCheckout: httpsCallable(functions, "stripeCreateChannelPlanCheckout"),
  stripeCreateViewerMembershipCheckout: httpsCallable(functions, "stripeCreateViewerMembershipCheckout"),
  stripeCreateAdCheckout: httpsCallable(functions, "stripeCreateAdCheckout"),
};

