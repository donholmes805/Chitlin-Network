'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { db } from "@/lib/firebase/config";
import type { Channel } from "@/types";
import { collection, getDocs, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "System Check", href: "/admin/system-check" },
];

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "channels"), orderBy("createdAt", "desc")));
        setChannels(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Channel[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const setStatus = async (id: string, status: Channel["status"]) => {
    setSavingId(id);
    try {
      await updateDoc(doc(db, "channels", id), { status });
      setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } catch (e) {
      console.error(e);
      alert("Failed to update channel.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={["admin", "owner"]}>
      <DashboardShell navItems={adminNavItems} userName="Network Admin" channelName="Channels">
        <div className="glass-panel rounded-3xl border-white/5 p-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Channels</h1>
              <p className="text-on-surface-variant text-sm">Approve, reject, or suspend networks.</p>
            </div>
          </div>

          {loading ? (
            <div className="h-[260px] rounded-2xl bg-surface-container-high animate-pulse" />
          ) : channels.length === 0 ? (
            <div className="p-14 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
              No channels yet.
            </div>
          ) : (
            <div className="space-y-4">
              {channels.map((c) => (
                <div key={c.id} className="p-6 rounded-2xl bg-surface-container-low border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">{c.category}</p>
                    <p className="font-bold text-white truncate">{c.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">Owner: {c.ownerId}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-2">{c.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={savingId === c.id}
                      onClick={() => setStatus(c.id, "approved")}
                      className="px-5 py-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={savingId === c.id}
                      onClick={() => setStatus(c.id, "rejected")}
                      className="px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      disabled={savingId === c.id}
                      onClick={() => setStatus(c.id, "suspended")}
                      className="px-5 py-3 rounded-xl bg-white/5 text-on-surface-variant border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
