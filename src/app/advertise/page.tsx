'use client';

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import { callables } from "@/lib/firebase/callables";
import { db } from "@/lib/firebase/config";
import type { Channel } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AD_PACKAGES, PRICING_CONFIG } from "@/lib/pricing";

export default function AdvertisePage() {
  const configured = Boolean(PRICING_CONFIG.STRIPE_PUBLISHABLE_KEY);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    advertiserName: "",
    email: "",
    businessName: "",
    channelId: "",
    notes: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "channels"), where("status", "==", "approved")));
        setChannels(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Channel[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const checkout = async (pkg: (typeof AD_PACKAGES)[number]) => {
    setError(null);
    if (!configured || !pkg.stripePriceId) {
      setError("Advertising checkout is being updated. Please contact support.");
      return;
    }
    if (!form.advertiserName.trim() || !form.email.trim()) {
      setError("Please provide your advertiser name and contact email.");
      return;
    }
    setSubmitting(pkg.id);
    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/checkout/cancel`;
      const resp = await callables.stripeCreateAdCheckout({
        priceId: pkg.stripePriceId,
        successUrl,
        cancelUrl,
        advertiserName: form.advertiserName,
        email: form.email,
        packageType: pkg.id,
        channelId: form.channelId || null,
        businessName: form.businessName,
        notes: form.notes,
      });
      const url = (resp.data as any)?.url as string | undefined;
      if (!url) throw new Error("Missing checkout URL");
      window.location.assign(url);
    } catch (e) {
      console.error(e);
      setError("Checkout failed. Please check your details and try again.");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <PublicHeader />

      <main className="flex-grow pt-40 pb-32">
        {/* Media Kit Header */}
        <section className="safe-area mb-24 space-y-8">
           <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-8 py-3 rounded-full">
              <span className="material-symbols-outlined text-primary text-xl">campaign</span>
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Media Kit & Advertising</span>
            </div>
          <h1 className="text-6xl md:text-9xl font-headlines font-black italic tracking-tighter text-white leading-none">
            Reach the <br/>
            <span className="text-gold">Next Generation.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed editorial-text">
            Connect your brand with a highly engaged, global audience of independent Black media consumers. 
            Professional ad packages designed for results.
          </p>
        </section>

        {error && (
          <div className="safe-area max-w-4xl bg-red-500/10 border border-red-500/20 p-8 rounded-3xl mb-12 flex items-center gap-6">
            <span className="material-symbols-outlined text-red-500 text-3xl">report_problem</span>
            <p className="text-red-200 text-sm font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 safe-area items-start">
          
          {/* Advertiser Form — Professional Sidebar */}
          <div className="lg:col-span-5 space-y-12">
            <div className="glass-panel rounded-[2.5rem] p-10 border-white/5 space-y-10 shadow-2xl">
              <div className="space-y-2">
                <h2 className="text-2xl font-headlines font-black italic text-white">Campaign Details</h2>
                <p className="text-xs text-on-surface-variant font-medium">Please provide your contact and targeting info before selecting a package.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  {[
                    { key: "advertiserName", label: "Full Name", placeholder: "e.g. John Doe", icon: 'person' },
                    { key: "email", label: "Contact Email", placeholder: "e.g. john@business.com", icon: 'mail' },
                    { key: "businessName", label: "Business/Brand", placeholder: "e.g. Acme Media", icon: 'business' },
                  ].map((f) => (
                    <div key={f.key} className="space-y-3 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-container flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">{f.icon}</span>
                        {f.label}
                      </label>
                      <input
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-6 py-4 rounded-xl bg-surface-container-low border border-white/5 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium placeholder:text-outline"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">target</span>
                    Target Network Channel
                  </label>
                  <select
                    value={form.channelId}
                    onChange={(e) => setForm((p) => ({ ...p, channelId: e.target.value }))}
                    className="w-full px-6 py-4 rounded-xl bg-surface-container-low border border-white/5 outline-none focus:border-primary/40 transition-all text-sm font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-surface">Platform-Wide Rotation</option>
                    {channels.map((c) => (
                      <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">notes</span>
                    Campaign Vision & Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    rows={4}
                    placeholder="Describe your goals and creative direction..."
                    className="w-full px-6 py-4 rounded-xl bg-surface-container-low border border-white/5 outline-none focus:border-primary/40 transition-all text-sm font-medium resize-none placeholder:text-outline"
                  />
                </div>
              </div>
            </div>

            {/* Why Advertise Social Proof */}
            <div className="space-y-8 pl-6">
               {[
                 { title: '8.4M Monthly Reach', desc: 'Connect with a massive, dedicated audience of cultural trendsetters.' },
                 { title: 'Native Integration', desc: 'Ads look and feel like part of the streaming experience.' },
                 { title: 'Real-Time Insights', desc: 'Track impressions, clicks, and conversions on your dashboard.' }
               ].map(item => (
                 <div key={item.title} className="flex gap-6 group">
                    <div className="w-1 h-12 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{item.title}</h4>
                      <p className="text-on-surface-variant text-sm mt-1">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Ad Packages Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {AD_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`relative group rounded-[2.5rem] p-0.5 transition-all duration-700 hover:-translate-y-4 ${
                  pkg.id === 'featured' ? 'md:col-span-2 bg-gradient-to-r from-primary/60 via-primary-container to-transparent' : 'bg-white/10'
                }`}
              >
                <div className="bg-surface-container-high rounded-[2.4rem] p-12 h-full flex flex-col border border-white/5 relative overflow-hidden">
                   <div className="flex-grow space-y-10">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${pkg.id === 'featured' ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {pkg.name}
                          </p>
                          {pkg.id === 'featured' && (
                            <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Most Popular</span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-headlines font-black italic text-white leading-none">${pkg.price}</span>
                          <span className="text-on-surface-variant font-black uppercase tracking-widest text-[10px]">/ Campaign</span>
                        </div>
                        <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-sm">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="h-px bg-white/5" />

                      <ul className={`grid gap-4 ${pkg.id === 'featured' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                        {pkg.features.map((p) => (
                          <li key={p} className="flex items-start gap-4 text-on-surface text-[13px] font-medium group/item">
                            <span className="material-symbols-outlined text-primary text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <span className="opacity-80 group-hover:opacity-100 transition-opacity">{p}</span>
                          </li>
                        ))}
                      </ul>
                   </div>

                   <div className="mt-12">
                      <button
                        onClick={() => checkout(pkg)}
                        disabled={!configured || !pkg.stripePriceId || submitting === pkg.id}
                        className={`w-full btn-premium ${pkg.id === 'featured' ? 'bg-primary text-on-primary shadow-[0_0_50px_rgba(242,202,80,0.3)]' : 'btn-outline shadow-none'} !rounded-2xl !py-6 !text-[11px]`}
                      >
                        {submitting === pkg.id ? "Initializing..." : "Proceed to Checkout"}
                      </button>
                      <p className="text-[9px] text-center text-on-surface-variant font-black uppercase tracking-[0.3em] mt-6 opacity-40">
                        Price includes creative review fee
                      </p>
                   </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
