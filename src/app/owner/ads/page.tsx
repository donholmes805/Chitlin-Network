'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import type { Ad, Channel } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Overview", href: "/owner" },
  { label: "Channel Profile", href: "/owner/channel" },
  { label: "Shows", href: "/owner/shows" },
  { label: "Upload", href: "/owner/upload" },
  { label: "Schedule", href: "/owner/schedule" },
  { label: "Ads", href: "/owner/ads" },
  { label: "Analytics", href: "/owner/analytics" },
  { label: "Revenue", href: "/owner/revenue" },
];

export default function OwnerAdsPage() {
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      setLoading(true);
      try {
        const chSnap = await getDocs(query(collection(db, "channels"), where("ownerId", "==", user.email)));
        const ch = chSnap.empty ? null : ({ id: chSnap.docs[0].id, ...(chSnap.docs[0].data() as any) } as Channel);
        setChannel(ch);
        if (!ch) return;

        const aSnap = await getDocs(query(collection(db, "ads"), where("channelId", "==", ch.id)));
        setAds(aSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Ad[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.email]);

  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName={channel?.name || "Ads"}>
        {loading ? (
          <div className="h-[360px] rounded-2xl bg-surface-container-high animate-pulse" />
        ) : !channel ? (
          <div className="glass-panel rounded-3xl border-white/5 p-12">
            <h1 className="text-4xl font-headlines font-black italic mb-4">No Channel Found</h1>
            <p className="text-on-surface-variant text-sm">Create your channel profile first.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border-white/5 p-10">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Ads</h1>
                <p className="text-on-surface-variant text-sm">View ad inventory for your channel. Ad sales checkout is added in the Stripe phase.</p>
              </div>
              <button className="bg-surface-container-high px-8 py-4 rounded-xl border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                Create Ad (Soon)
              </button>
            </div>

            {ads.length === 0 ? (
              <div className="p-14 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
                No ads found for this channel.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((ad) => (
                  <div key={ad.id} className="p-6 rounded-2xl bg-surface-container-low border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">{ad.type}</p>
                    <h3 className="font-bold text-white mb-2">{ad.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{ad.advertiserName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-4">{ad.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DashboardShell>
    </RoleGuard>
  );
}

