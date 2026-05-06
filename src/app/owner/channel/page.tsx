'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import type { Channel } from "@/types";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
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

export default function OwnerChannelProfilePage() {
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", category: "", logoUrl: "", bannerUrl: "" });
  const canCreate = Boolean(user?.email);

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "channels"), where("ownerId", "==", user.email)));
        if (snap.empty) {
          setChannel(null);
          return;
        }
        const ch = { id: snap.docs[0].id, ...(snap.docs[0].data() as any) } as Channel;
        setChannel(ch);
        setForm({
          name: ch.name ?? "",
          slug: ch.slug ?? "",
          description: ch.description ?? "",
          category: ch.category ?? "",
          logoUrl: ch.logoUrl ?? "",
          bannerUrl: ch.bannerUrl ?? "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.email]);

  const isNew = !channel;
  const isValid = useMemo(() => form.name.trim() && form.slug.trim() && form.category.trim(), [form]);

  const save = async () => {
    if (!user?.email) return;
    if (!isValid) return;
    setSaving(true);
    try {
      if (channel) {
        await updateDoc(doc(db, "channels", channel.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create as pending review (admins/owner can approve)
        const ref = doc(collection(db, "channels"));
        await setDoc(ref, {
          id: ref.id,
          ownerId: user.email,
          plan: "free",
          revenueSplit: { platformPercentage: 40, channelOwnerPercentage: 60 },
          featured: false,
          liveNow: false,
          posterUrl: form.bannerUrl || "",
          liveStreamUrl: "",
          status: "pending_review",
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setChannel({ id: ref.id, ownerId: user.email } as any);
      }
      alert(isNew ? "Channel created (pending review)." : "Channel updated.");
    } catch (e) {
      console.error(e);
      alert("Failed to save channel.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName={channel?.name || "Channel Profile"}>
        {loading ? (
          <div className="h-[320px] rounded-2xl bg-surface-container-high animate-pulse" />
        ) : (
          <div className="glass-panel rounded-3xl border-white/5 p-10 max-w-4xl">
            <div className="flex items-start justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-3">Channel Profile</h1>
                <p className="text-on-surface-variant text-sm">
                  {channel ? "Update your channel metadata." : "Create your channel profile to enter review."}
                </p>
              </div>
              <button
                disabled={!canCreate || !isValid || saving}
                onClick={save}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {saving ? "Saving..." : channel ? "Save Changes" : "Create Channel"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: "name", label: "Channel Name", placeholder: "Your Network Name" },
                { key: "slug", label: "Slug", placeholder: "my-channel" },
                { key: "category", label: "Category", placeholder: "News, Music, Sports..." },
                { key: "logoUrl", label: "Logo URL", placeholder: "https://..." },
                { key: "bannerUrl", label: "Banner URL", placeholder: "https://..." },
              ].map((f) => (
                <div key={f.key as any} className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">{f.label}</p>
                  <input
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Description</p>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your channel..."
                  rows={5}
                  className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
            </div>

            {!channel && (
              <div className="mt-10 p-6 rounded-2xl bg-surface-container-low border border-dashed border-white/10 text-on-surface-variant text-sm">
                After creating, your channel will appear as <span className="text-primary font-bold">Pending Review</span> until approved by Admin/Owner.
              </div>
            )}
          </div>
        )}
      </DashboardShell>
    </RoleGuard>
  );
}

