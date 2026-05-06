'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { db } from "@/lib/firebase/config";
import type { Episode, Show } from "@/types";
import { collection, getDocs, orderBy, query, updateDoc, doc, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "System Check", href: "/admin/system-check" },
];

export default function AdminContentPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [sSnap, eSnap] = await Promise.all([
          getDocs(query(collection(db, "shows"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "episodes"), orderBy("createdAt", "desc"))),
        ]);
        setShows(sSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Show[]);
        setEpisodes(eSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Episode[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const approveShow = async (id: string) => {
    setSaving(id);
    try {
      await updateDoc(doc(db, "shows", id), { status: "approved" });
      setShows((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)));
    } finally {
      setSaving(null);
    }
  };

  const approveEpisode = async (id: string) => {
    setSaving(id);
    try {
      await updateDoc(doc(db, "episodes", id), { status: "approved" });
      setEpisodes((prev) => prev.map((e) => (e.id === id ? { ...e, status: "approved" } : e)));
    } finally {
      setSaving(null);
    }
  };

  const pendingShows = shows.filter((s) => s.status === "pending_review");
  const pendingEpisodes = episodes.filter((e) => e.status === "pending_review");

  return (
    <RoleGuard allowedRoles={["admin", "owner"]}>
      <DashboardShell navItems={adminNavItems} userName="Network Admin" channelName="Content">
        <div className="space-y-10">
          <div className="glass-panel rounded-3xl border-white/5 p-10">
            <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Content</h1>
            <p className="text-on-surface-variant text-sm">Review pending shows and episodes.</p>
          </div>

          {loading ? (
            <div className="h-[260px] rounded-2xl bg-surface-container-high animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="glass-panel rounded-3xl border-white/5 p-10">
                <h2 className="text-2xl font-headlines font-black italic mb-6">Pending Shows</h2>
                {pendingShows.length === 0 ? (
                  <div className="p-10 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">No pending shows.</div>
                ) : (
                  <div className="space-y-4">
                    {pendingShows.slice(0, 20).map((s) => (
                      <div key={s.id} className="p-5 rounded-2xl bg-surface-container-low border border-white/5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{s.title}</p>
                          <p className="text-xs text-on-surface-variant truncate">Channel: {s.channelId}</p>
                        </div>
                        <button
                          disabled={saving === s.id}
                          onClick={() => approveShow(s.id)}
                          className="px-5 py-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="glass-panel rounded-3xl border-white/5 p-10">
                <h2 className="text-2xl font-headlines font-black italic mb-6">Pending Episodes</h2>
                {pendingEpisodes.length === 0 ? (
                  <div className="p-10 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">No pending episodes.</div>
                ) : (
                  <div className="space-y-4">
                    {pendingEpisodes.slice(0, 20).map((e) => (
                      <div key={e.id} className="p-5 rounded-2xl bg-surface-container-low border border-white/5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{e.title}</p>
                          <p className="text-xs text-on-surface-variant truncate">Show: {e.showId}</p>
                        </div>
                        <button
                          disabled={saving === e.id}
                          onClick={() => approveEpisode(e.id)}
                          className="px-5 py-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
