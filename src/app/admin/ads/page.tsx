'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { db } from "@/lib/firebase/config";
import type { AdOrder, Channel } from "@/types";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "System Check", href: "/admin/system-check" },
];

function toDate(value: any): Date | null {
  return value?.toDate?.() ?? null;
}

export default function AdminAdsPage() {
  const [orders, setOrders] = useState<AdOrder[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [oSnap, cSnap] = await Promise.all([
          getDocs(query(collection(db, "adOrders"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "channels"), orderBy("createdAt", "desc"))),
        ]);
        setOrders(oSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as AdOrder[]);
        setChannels(cSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Channel[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const byId = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels]);

  const setStatus = async (id: string, status: AdOrder["status"]) => {
    setSavingId(id);
    try {
      await updateDoc(doc(db, "adOrders", id), { status, updatedAt: serverTimestamp() });
      setOrders((prev) => prev.map((o) => (o.id === id ? ({ ...o, status } as any) : o)));
    } catch (e) {
      console.error(e);
      alert("Failed to update ad order.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={["admin", "owner"]}>
      <DashboardShell navItems={adminNavItems} userName="Network Admin" channelName="Ad Orders">
        <div className="glass-panel rounded-3xl border-white/5 p-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Ad Orders</h1>
              <p className="text-on-surface-variant text-sm">Review paid orders before activating campaigns.</p>
            </div>
          </div>

          {loading ? (
            <div className="h-[260px] rounded-2xl bg-surface-container-high animate-pulse" />
          ) : orders.length === 0 ? (
            <div className="p-14 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
              No ad orders yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 50).map((o) => {
                const ch = o.channelId ? byId.get(o.channelId) : null;
                const created = toDate(o.createdAt);
                return (
                  <div key={o.id} className="p-6 rounded-2xl bg-surface-container-low border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">{o.packageType}</p>
                      <p className="font-bold text-white truncate">{o.advertiserName}</p>
                      <p className="text-xs text-on-surface-variant truncate">{o.email}</p>
                      <p className="text-xs text-on-surface-variant truncate">Channel: {ch?.name || "Platform Rotation"}</p>
                      <p className="text-[10px] text-on-surface-variant mt-2">
                        Created: {created ? created.toLocaleString() : "—"} • Status: <span className="font-black uppercase tracking-widest">{o.status}</span>
                      </p>
                      {o.stripeCheckoutSessionId && (
                        <p className="text-[10px] text-on-surface-variant mt-1">Session: {o.stripeCheckoutSessionId}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={savingId === o.id}
                        onClick={() => setStatus(o.id, "active")}
                        className="px-5 py-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        Mark Active
                      </button>
                      <button
                        disabled={savingId === o.id}
                        onClick={() => setStatus(o.id, "completed")}
                        className="px-5 py-3 rounded-xl bg-white/5 text-on-surface border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-50"
                      >
                        Completed
                      </button>
                      <button
                        disabled={savingId === o.id}
                        onClick={() => setStatus(o.id, "rejected")}
                        className="px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}

