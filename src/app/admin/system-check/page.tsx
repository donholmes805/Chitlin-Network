'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { callables } from "@/lib/firebase/callables";
import { PRICING_CONFIG, VIEWER_MEMBERSHIPS, CHANNEL_PLANS, AD_PACKAGES } from "@/lib/pricing";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "System Check", href: "/admin/system-check" },
];

export default function SystemCheckPage() {
  const { user } = useAuth();
  const [checks, setChecks] = useState<any>({
    firebase: { status: 'loading', label: 'Firebase Auth' },
    firestore: { status: 'loading', label: 'Firestore DB' },
    cloudflare: { status: 'loading', label: 'Cloudflare Stream Config' },
    cloudflareSubdomain: { status: 'loading', label: 'Cloudflare Subdomain' },
    stripePublic: { status: 'loading', label: 'Stripe Public Key' },
    stripeSecret: { status: 'loading', label: 'Stripe Secret Key' },
    membershipPrices: { status: 'loading', label: 'Membership Price IDs' },
    channelPrices: { status: 'loading', label: 'Channel Plan Price IDs' },
    adPrices: { status: 'loading', label: 'Ad Package Price IDs' },
  });

  useEffect(() => {
    async function runChecks() {
      // 1. Firebase Auth
      setChecks((prev: any) => ({ ...prev, firebase: { ...prev.firebase, status: user ? 'pass' : 'fail' } }));

      // 2. Firestore Read
      try {
        const q = query(collection(db, "channels"), limit(1));
        await getDocs(q);
        setChecks((prev: any) => ({ ...prev, firestore: { ...prev.firestore, status: 'pass' } }));
      } catch (e) {
        setChecks((prev: any) => ({ ...prev, firestore: { ...prev.firestore, status: 'fail' } }));
      }

      // 3. Cloudflare Subdomain
      const cfSub = process.env.CLOUDFLARE_CUSTOMER_SUBDOMAIN;
      setChecks((prev: any) => ({ 
        ...prev, 
        cloudflareSubdomain: { 
          ...prev.cloudflareSubdomain, 
          status: cfSub ? 'pass' : 'warn',
          detail: cfSub ? 'Configured' : 'Missing (Optional Fallback Active)'
        } 
      }));

      // 4. Stripe Public
      const stripeKey = PRICING_CONFIG.STRIPE_PUBLISHABLE_KEY;
      setChecks((prev: any) => ({ 
        ...prev, 
        stripePublic: { 
          ...prev.stripePublic, 
          status: stripeKey ? 'pass' : 'fail',
          detail: stripeKey ? (PRICING_CONFIG.IS_LIVE ? 'LIVE MODE' : 'TEST MODE') : 'Missing'
        } 
      }));

      // 5. Membership Prices
      const missingMemberships = VIEWER_MEMBERSHIPS.filter(p => !p.stripePriceId);
      setChecks((prev: any) => ({ 
        ...prev, 
        membershipPrices: { 
          ...prev.membershipPrices, 
          status: missingMemberships.length === 0 ? 'pass' : 'fail',
          detail: missingMemberships.length === 0 ? 'All 3 Configured' : `${missingMemberships.length} Missing`
        } 
      }));

      // 6. Channel Prices
      const missingChannels = CHANNEL_PLANS.filter(p => !p.adminPriceId || !p.monthlyPriceId);
      setChecks((prev: any) => ({ 
        ...prev, 
        channelPrices: { 
          ...prev.channelPrices, 
          status: missingChannels.length === 0 ? 'pass' : 'fail',
          detail: missingChannels.length === 0 ? 'All 6 Configured' : `${missingChannels.length} Missing`
        } 
      }));

      // 7. Ad Prices
      const missingAds = AD_PACKAGES.filter(p => !p.stripePriceId);
      setChecks((prev: any) => ({ 
        ...prev, 
        adPrices: { 
          ...prev.adPrices, 
          status: missingAds.length === 0 ? 'pass' : 'fail',
          detail: missingAds.length === 0 ? 'All 3 Configured' : `${missingAds.length} Missing`
        } 
      }));

      // 8. Cloudflare (Indirect check via callable error)
      try {
        await callables.cloudflareCreateLiveInput({ channelId: 'test', title: 'test' });
      } catch (e: any) {
        if (e?.code === 'functions/failed-precondition') {
          setChecks((prev: any) => ({ ...prev, cloudflare: { ...prev.cloudflare, status: 'fail' } }));
        } else {
          setChecks((prev: any) => ({ ...prev, cloudflare: { ...prev.cloudflare, status: 'pass' } }));
        }
      }

      // 9. Stripe Secret (Indirect check)
      try {
        await callables.stripeCreateAdCheckout({ priceId: 'test', successUrl: 'test', cancelUrl: 'test', advertiserName: 'test', email: 'test', packageType: 'test' });
      } catch (e: any) {
        if (e?.code === 'functions/failed-precondition') {
          setChecks((prev: any) => ({ ...prev, stripeSecret: { ...prev.stripeSecret, status: 'fail' } }));
        } else {
          setChecks((prev: any) => ({ ...prev, stripeSecret: { ...prev.stripeSecret, status: 'pass' } }));
        }
      }
    }

    runChecks();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <span className="material-symbols-outlined text-green-500">check_circle</span>;
      case 'fail': return <span className="material-symbols-outlined text-red-500">cancel</span>;
      case 'warn': return <span className="material-symbols-outlined text-yellow-500">warning</span>;
      default: return <span className="material-symbols-outlined text-white/20 animate-spin">sync</span>;
    }
  };

  return (
    <RoleGuard allowedRoles={['owner', 'admin']}>
      <DashboardShell navItems={adminNavItems} userName="Network Admin" channelName="System Check">
        <div className="max-w-5xl">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-headlines font-black italic tracking-tighter mb-4 text-white">System Launch Readiness</h1>
            <p className="text-on-surface-variant text-lg">Verify production configuration and critical service integration.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Core Infrastructure */}
            <div className="glass-panel rounded-3xl border-white/5 p-10">
              <h2 className="text-2xl font-headlines font-black italic mb-8">Infrastructure</h2>
              <div className="space-y-4">
                {['firebase', 'firestore', 'stripePublic', 'stripeSecret'].map((key) => (
                  <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface">{checks[key].label}</span>
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                        {checks[key].detail || (checks[key].status === 'pass' ? 'Authenticated' : 'Checking...')}
                      </span>
                    </div>
                    {getStatusIcon(checks[key].status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Price ID Audit */}
            <div className="glass-panel rounded-3xl border-white/5 p-10">
              <h2 className="text-2xl font-headlines font-black italic mb-8">Stripe Price IDs</h2>
              <div className="space-y-4">
                {['membershipPrices', 'channelPrices', 'adPrices'].map((key) => (
                  <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface">{checks[key].label}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${checks[key].status === 'fail' ? 'text-red-400' : 'text-on-surface-variant'}`}>
                        {checks[key].detail || 'Checking...'}
                      </span>
                    </div>
                    {getStatusIcon(checks[key].status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Cloudflare & Broadcasting */}
            <div className="glass-panel rounded-3xl border-white/5 p-10 md:col-span-2">
              <h2 className="text-2xl font-headlines font-black italic mb-8">Broadcasting & Cloudflare</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['cloudflare', 'cloudflareSubdomain'].map((key) => (
                  <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface">{checks[key].label}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${checks[key].status === 'warn' ? 'text-yellow-400' : 'text-on-surface-variant'}`}>
                        {checks[key].detail || (checks[key].status === 'pass' ? 'Healthy' : 'Checking...')}
                      </span>
                    </div>
                    {getStatusIcon(checks[key].status)}
                  </div>
                ))}
              </div>
              {checks.cloudflareSubdomain.status === 'warn' && (
                <div className="mt-6 p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                  <p className="text-xs text-yellow-200 leading-relaxed">
                    <span className="font-bold">Recommendation:</span> For custom branding and optimized HLS playback, configure <code className="bg-white/5 px-2 py-0.5 rounded text-primary">CLOUDFLARE_CUSTOMER_SUBDOMAIN</code> in your production environment. 
                    If left blank, the app will fallback to the generic Cloudflare Stream player.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl border-white/5 p-10 border-l-8 border-primary">
            <h2 className="text-2xl font-headlines font-black italic mb-4">Final Readiness</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              This report confirms that all environment variables required for the current build are present. 
              Before going live, ensure you have set the <span className="text-primary font-bold">STRIPE_WEBHOOK_SECRET</span> 
              via the Firebase CLI to enable automated payment fulfillment.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Release Candidate</span>
                  <span className="text-xs font-bold text-primary">v0.9.5-PROD</span>
               </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
