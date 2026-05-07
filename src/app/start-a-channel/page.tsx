'use client';

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { callables } from "@/lib/firebase/callables";
import { useState } from "react";
import { CHANNEL_PLANS, PRICING_CONFIG } from "@/lib/pricing";

export default function StartAChannelPage() {
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
    
    const plan = CHANNEL_PLANS.find(p => p.id === tierId);
    if (!plan?.adminPriceId || !plan?.monthlyPriceId || !configured) {
      setError("Checkout is not configured yet for this plan.");
      return;
    }

    setLoadingTier(tierId);
    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/checkout/cancel`;
      const resp = await callables.stripeCreateChannelPlanCheckout({ 
        planType: tierId, 
        successUrl, 
        cancelUrl,
        email: user.email 
      });
      const url = (resp.data as any)?.url as string | undefined;
      if (!url) throw new Error("Missing checkout URL");
      window.location.assign(url);
    } catch (e) {
      console.error(e);
      setError("Checkout failed. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <PublicHeader />

      <main className="flex-grow pt-40 pb-32">
        {/* Header Section */}
        <section className="safe-area mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]" />
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Media Ownership</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headlines font-black italic tracking-tighter text-white leading-none">
                Start a Channel. <br/>
                <span className="text-gold">Build Your Empire.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed editorial-text">
                Chitlin’ Network is the only platform designed to give independent Black creators true ownership. Launch your professional channel in minutes.
              </p>
            </div>
            <div className="flex-shrink-0 bg-surface-container-high border border-outline-variant p-10 rounded-3xl text-center md:text-left shadow-2xl">
              <p className="text-3xl font-headlines font-black text-white italic mb-1">150+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Active Channels Live</p>
            </div>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="safe-area">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-12 flex items-center gap-4">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-red-200 text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {CHANNEL_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative group rounded-[2.5rem] p-1 shadow-2xl transition-all duration-700 hover:-translate-y-4 ${
                  plan.id === 'growth' ? 'bg-gradient-to-b from-primary/40 to-transparent' : 'bg-white/5'
                }`}
              >
                <div className="bg-surface-container-high rounded-[2.3rem] p-12 h-full flex flex-col border border-white/5 overflow-hidden relative">
                  {/* Highlight Glow */}
                  {plan.id === 'growth' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none" />
                  )}

                  <div className="flex-grow space-y-8">
                    <div className="space-y-4">
                      <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${plan.id === 'growth' ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {plan.name}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-headlines font-black italic text-white leading-none">${plan.monthlyFee}</span>
                        <span className="text-on-surface-variant font-black uppercase tracking-widest text-xs">/mo</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-container leading-none">
                        + {plan.adminFee} admin fee (One-Time)
                      </p>
                    </div>

                    <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                      {plan.description}
                    </p>

                    <div className="h-px bg-white/5" />

                    <ul className="space-y-4">
                      {plan.features.map((p) => (
                        <li key={p} className="flex items-start gap-4 text-on-surface text-sm font-medium">
                          <span className="material-symbols-outlined text-primary text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          <span className="opacity-80 group-hover:opacity-100 transition-opacity">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-12 space-y-6">
                    <button
                      onClick={() => startCheckout(plan.id)}
                      disabled={loadingTier === plan.id}
                      className={`w-full btn-premium ${plan.id === 'growth' ? 'bg-primary text-on-primary' : 'btn-outline shadow-none hover:bg-white/5'} !rounded-2xl !py-6 !text-[11px]`}
                    >
                      {loadingTier === plan.id ? "Redirecting to Stripe..." : user ? `Select ${plan.name}` : "Sign In to Start"}
                    </button>
                    
                    <p className="text-[10px] text-center text-on-surface-variant font-bold uppercase tracking-[0.2em] opacity-60">
                      Cancel or upgrade anytime
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Prop Section */}
        <section className="py-48 safe-area">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
             <div className="space-y-12">
               <h2 className="text-5xl md:text-7xl font-headlines font-black text-white italic tracking-tighter leading-none">
                 Why the Network?
               </h2>
               <div className="space-y-10">
                 {[
                   { icon: 'lock', title: 'Data Sovereignty', desc: 'Own your audience data. You get full access to your subscribers emails and viewing habits.' },
                   { icon: 'payments', title: 'Better Splits', desc: 'We offer industry-leading revenue splits for ads and memberships. Your content, your profit.' },
                   { icon: 'video_stable', title: 'Pro Broadcasting', desc: 'Broadcast in 4K with low latency using our Cloudflare Stream powered infrastructure.' }
                 ].map(item => (
                   <div key={item.title} className="flex gap-6 group">
                     <div className="flex-shrink-0 w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 border-primary/20">
                       <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                     </div>
                     <div className="space-y-2">
                       <h4 className="text-xl font-bold text-white uppercase tracking-widest text-xs">{item.title}</h4>
                       <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-[80px] pointer-events-none" />
                <div className="relative overflow-hidden feather-mask-all">
                   <img 
                     src="https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&q=80&w=1000" 
                     className="w-full aspect-square object-cover"
                     alt="Creator Dashboard Preview"
                   />
                   <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-background border border-outline-variant rounded-full flex flex-col items-center justify-center shadow-2xl p-6 text-center animate-float">
                      <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Revenue Potential</p>
                      <p className="text-3xl font-headlines font-black text-white italic">$50K+</p>
                      <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-tighter mt-1">For Top Tier Channels</p>
                   </div>
                </div>
              </div>
          </div>
        </section>

        {/* Enterprise Call */}
        <section className="safe-area">
          <div className="bg-gradient-to-r from-surface-container-highest to-surface-container-low border border-white/5 rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none" />
             <h2 className="text-4xl md:text-6xl font-headlines font-black text-white italic tracking-tighter">Large Network or Media Brand?</h2>
             <p className="text-xl text-on-surface-variant max-w-2xl mx-auto editorial-text">
               We offer custom enterprise solutions for established networks, sports leagues, and music labels requiring white-labeled infrastructure.
             </p>
             <div className="pt-4">
               <Link href="/advertise" className="btn-outline !px-16 !py-6 !text-xs !rounded-xl">
                 Contact Partnerships
               </Link>
             </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
