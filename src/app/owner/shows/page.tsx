'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import type { Channel, Show } from "@/types";
import Link from "next/link";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function OwnerShowsPage() {
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      setLoading(true);
      try {
        const chSnap = await getDocs(query(collection(db, "channels"), where("ownerId", "==", user.email)));
        const ch = chSnap.empty ? null : ({ id: chSnap.docs[0].id, ...(chSnap.docs[0].data() as any) } as Channel);
        setChannel(ch);
        if (!ch) return;

        const sSnap = await getDocs(query(collection(db, "shows"), where("channelId", "==", ch.id)));
        setShows(sSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Show[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.email]);

  const canCreate = useMemo(() => Boolean(channel && user?.email), [channel, user?.email]);

  const createShow = async () => {
    if (!channel || !user?.email) return;
    if (!title.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "shows"), {
        channelId: channel.id,
        ownerId: user.email,
        title: title.trim(),
        slug: `${slugify(title)}-${channel.id.slice(0, 6)}`,
        description: description.trim() || "New show description coming soon.",
        category: category.trim() || channel.category,
        rating: "TV-PG",
        posterUrl: channel.logoUrl,
        bannerUrl: channel.bannerUrl,
        status: "pending_review",
        featured: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle("");
      setCategory("");
      setDescription("");
      alert("Show created (pending review).");
      // reload list
      const sSnap = await getDocs(query(collection(db, "shows"), where("channelId", "==", channel.id)));
      setShows(sSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Show[]);
    } catch (e) {
      console.error(e);
      alert("Failed to create show.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName={channel?.name || "Shows"}>
        {loading ? (
          <div className="h-[360px] rounded-2xl bg-surface-container-high animate-pulse" />
        ) : !channel ? (
          <div className="glass-panel rounded-3xl border-white/5 p-12 text-center">
            <h1 className="text-4xl font-headlines font-black italic mb-4">No Channel Found</h1>
            <p className="text-on-surface-variant mb-10">Create your channel profile first.</p>
            <Link href="/owner/channel" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
              Create Channel Profile
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="glass-panel rounded-3xl border-white/5 p-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Shows</h1>
                  <p className="text-on-surface-variant text-sm">Create and manage your channel&apos;s series. New content starts as pending review.</p>
                </div>
                <button
                  disabled={!canCreate || creating || !title.trim()}
                  onClick={createShow}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {creating ? "Creating..." : "Create Show"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Title</p>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40" placeholder="New show title" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Category</p>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40" placeholder={channel.category} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Description</p>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40 resize-none" placeholder="What is this show about?" />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl border-white/5 p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-headlines font-black italic">Your Library</h2>
                <span className="text-on-surface-variant text-xs font-black uppercase tracking-widest">{shows.length} Total</span>
              </div>

              {shows.length === 0 ? (
                <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
                  No shows yet. Create your first series above.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {shows.map((s) => (
                    <Link key={s.id} href={`/shows/${s.id}`} className="group">
                      <div className="h-[220px] rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/50 transition-all shadow-2xl relative">
                        <img src={s.bannerUrl || s.posterUrl} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt={s.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                        <div className="absolute bottom-5 left-5 right-5">
                          <h3 className="text-2xl font-headlines font-black text-white group-hover:text-primary transition-colors line-clamp-1">{s.title}</h3>
                          <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">{s.status}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardShell>
    </RoleGuard>
  );
}

