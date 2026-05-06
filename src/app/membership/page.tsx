'use client';

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import { useAuth } from "@/context/AuthContext";
import { callables } from "@/lib/firebase/callables";
import { useState } from "react";
import { VIEWER_MEMBERSHIPS, PRICING_CONFIG } from "@/lib/pricing";

export default function MembershipPage() {
  const configured = Boolean(PRICING_CONFIG.STRIPE_PUBLISHABLE_KEY);
  const { user, signInWithGoogle } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (tierId: string) => {
    setError(null);
    if (!user) {
      signInWithGoogle();
      return;
    }
    
    const tier = VIEWER_MEMBERSHIPS.find(t => t.id === tierId);
    if (!tier?.stripePriceId || !configured) {
      setError("Membership system is currently under maintenance. Please try again later.");
      return;
    }

    setLoadingTier(tierId);
    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/checkout/cancel`;
      const resp = await callables.stripeCreateViewerMembershipCheckout({ 
        membershipType: tierId, 
        successUrl, 
        cancelUrl 
      });
      const url = (resp.data as any)?.url as string | undefined;
      if (!url) throw new Error("Missing checkout URL");
      window.location.assign(url);
    } catch (e) {
      console.error(e);
      setError("Something went wrong with the checkout. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <PublicHeader />

      <main className="flex-grow pt-40 pb-32">
        {/* Editorial Header */}
        <header className="safe-area mb-24 text-center space-y-8">
           <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-8 py-3 rounded-full">
              <span className="material-symbols-outlined text-primary text-xl">stars</span>
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Viewer Memberships</span>
            </div>
          <h1 className="text-6xl md:text-9xl font-headlines font-black italic tracking-tighter text-white leading-none">
            Unlock the <br/>
            <span className="text-gold">Full Experience.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed editorial-text">
            Support independent Black media and get exclusive access to live events, originals, and a premium community experience.
          </p>
        </header>

        {error && (
          <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 p-8 rounded-3xl mb-12 flex items-center gap-6">
            <span className="material-symbols-outlined text-red-500 text-3xl">info</span>
            <p className="text-red-200 text-sm font-bold uppercase tracking-widest leading-relaxed">{error}</p>
          </div>
        )}

        {/* Premium Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 safe-area max-w-7xl mx-auto">
          {VIEWER_MEMBERSHIPS.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative rounded-[2.5rem] p-0.5 group transition-all duration-700 hover:-translate-y-4 ${
                plan.id === 'premium' ? 'bg-gradient-to-br from-primary via-primary-container to-bronze shadow-[0_30px_100px_rgba(242,202,80,0.15)]' : 'bg-white/10'
              }`}
            >
              <div className="bg-surface-container-high rounded-[2.4rem] p-12 h-full flex flex-col border border-white/5 relative overflow-hidden">
                {plan.id === 'premium' && (
                  <div className="absolute top-0 right-0 px-8 py-2 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-bl-3xl shadow-xl">
                    Recommended
                  </div>
                )}
                
                <div className="flex-grow space-y-10">
                  <div className="space-y-4">
                    <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${plan.id === 'premium' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-headlines font-black italic text-white leading-none">{plan.price}</span>
                      <span className="text-on-surface-variant font-black uppercase tracking-widest text-xs">{plan.period}</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="h-px bg-white/5" />

                  <ul className="space-y-5">
                    {plan.features.map((p) => (
                      <li key={p} className="flex items-start gap-4 text-on-surface text-sm font-medium group/item">
                        <span className={`material-symbols-outlined text-xl leading-none ${plan.id === 'premium' ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-14 space-y-6">
                  <button
                    onClick={() => startCheckout(plan.id)}
                    disabled={loadingTier === plan.id}
                    className={`w-full btn-premium ${plan.id === 'premium' ? 'bg-primary text-on-primary' : 'btn-outline shadow-none'} !rounded-2xl !py-6 !text-[11px]`}
                  >
                    {loadingTier === plan.id ? "Initializing Checkout..." : "Start 14-Day Free Trial"}
                  </button>
                  
                  <p className="text-[9px] text-center text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-40">
                    Billed monthly. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support Info */}
        <div className="mt-32 max-w-4xl mx-auto text-center space-y-8 safe-area">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-60">
            Secure checkout powered by Stripe. Access granted immediately upon successful payment. 
            All memberships include a 14-day free trial for new subscribers only. By selecting a plan, 
            you agree to our community standards and terms of service. 
          </p>
          <div className="flex justify-center gap-12 grayscale opacity-40">
             <span className="material-symbols-outlined text-4xl">verified_user</span>
             <span className="material-symbols-outlined text-4xl">security</span>
             <span className="material-symbols-outlined text-4xl">lock</span>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
