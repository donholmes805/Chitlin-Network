'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { callables } from "@/lib/firebase/callables";
import { db } from "@/lib/firebase/config";
import type { Channel, LiveEvent } from "@/types";
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { label: "Overview", href: "/owner" },
  { label: "Channel Profile", href: "/owner/channel" },
  { label: "Shows", href: "/owner/shows" },
  { label: "Upload", href: "/owner/upload" },
  { label: "Schedule", href: "/owner/schedule" },
  { label: "Go Live", href: "/owner/live" },
  { label: "Ads", href: "/owner/ads" },
  { label: "Analytics", href: "/owner/analytics" },
  { label: "Revenue", href: "/owner/revenue" },
];

type IngestSecrets = { ingestUrl: string; streamKey: string } | null;

function toIsoLocal(d: Date) {
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function OwnerLivePage() {
  const { user, role } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [secrets, setSecrets] = useState<IngestSecrets>(null);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [statusSaving, setStatusSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "Live Broadcast",
    description: "",
    scheduledStart: "",
    scheduledEnd: "",
  });

  useEffect(() => {
    if (form.scheduledStart || form.scheduledEnd) return;
    const start = new Date(Date.now() + 30 * 60 * 1000);
    const end = new Date(Date.now() + 90 * 60 * 1000);
    setForm((p) => ({ ...p, scheduledStart: toIsoLocal(start), scheduledEnd: toIsoLocal(end) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdminLike = role === "owner" || role === "admin";

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      setLoading(true);
      setError(null);
      try {
        // Channels
        let chSnap;
        if (isAdminLike) {
          chSnap = await getDocs(query(collection(db, "channels"), orderBy("createdAt", "desc")));
        } else {
          chSnap = await getDocs(query(collection(db, "channels"), where("ownerId", "==", user.email)));
        }
        const ch = chSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Channel[];
        setChannels(ch);
        if (!selectedChannelId && ch.length > 0) setSelectedChannelId(ch[0]!.id);

        // Events
        let evSnap;
        if (isAdminLike) {
          evSnap = await getDocs(query(collection(db, "liveEvents"), orderBy("createdAt", "desc")));
        } else {
          evSnap = await getDocs(query(collection(db, "liveEvents"), where("ownerId", "==", user.email), orderBy("createdAt", "desc")));
        }
        setEvents(evSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as LiveEvent[]);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load live events.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdminLike, selectedChannelId, user?.email]);

  const selectedEvent = useMemo(() => events.find((e) => e.id === selectedEventId) ?? null, [events, selectedEventId]);

  useEffect(() => {
    async function loadSecrets() {
      if (!selectedEventId) return;
      setSecrets(null);
      try {
        const snap = await getDoc(doc(db, "liveEvents", selectedEventId, "private", "ingest"));
        if (!snap.exists()) return;
        const data = snap.data() as any;
        setSecrets({ ingestUrl: data.ingestUrl || "", streamKey: data.streamKey || "" });
      } catch (e) {
        // permissions or missing are fine
      }
    }
    loadSecrets();
  }, [selectedEventId]);

  const [billing, setBilling] = useState<any>(null);

  useEffect(() => {
    async function loadBilling() {
      if (!user?.email) return;
      try {
        const snap = await getDoc(doc(db, "billingByEmail", user.email));
        if (snap.exists()) setBilling(snap.data());
      } catch (e) {
        console.error("Billing load error:", e);
      }
    }
    loadBilling();
  }, [user?.email]);

  const createLive = async () => {
    if (!selectedChannelId) return;
    
    // Plan Enforcement
    if (role !== "owner") {
      const plan = billing?.channelPlan || "none";
      
      if (plan === "none" || plan === "starter") {
        setError("Live broadcasting is not available on your current plan. Please upgrade to a Growth or Network Partner plan.");
        return;
      }

      // Growth Plan limits: 1 per day, 90 mins
      if (plan === "growth") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const showsToday = events.filter(e => {
          const created = e.createdAt?.toDate ? e.createdAt.toDate() : new Date();
          return created >= today && e.status !== 'disabled';
        });

        if (showsToday.length >= 1) {
          setError("Growth Plan limit reached: 1 live show per day. Upgrade to Network Partner for expanded access.");
          return;
        }

        // Check duration
        if (form.scheduledStart && form.scheduledEnd) {
          const start = new Date(form.scheduledStart);
          const end = new Date(form.scheduledEnd);
          const diffMin = (end.getTime() - start.getTime()) / (1000 * 60);
          if (diffMin > 90) {
            setError("Growth Plan limit reached: Live shows are capped at 90 minutes. Upgrade for longer broadcasts.");
            return;
          }
        }
      }

      // Network Partner limits: 4 hours
      if (plan === "network_partner") {
        if (form.scheduledStart && form.scheduledEnd) {
          const start = new Date(form.scheduledStart);
          const end = new Date(form.scheduledEnd);
          const diffMin = (end.getTime() - start.getTime()) / (1000 * 60);
          if (diffMin > 240) {
            setError("Network Partner limit reached: Included live broadcasts are capped at 4 hours. Contact admin for extended duration.");
            return;
          }
        }
      }
    }

    setCreating(true);
    setError(null);
    try {
      const resp = await callables.cloudflareCreateLiveInput({
        channelId: selectedChannelId,
        title: form.title,
        description: form.description,
        scheduledStart: form.scheduledStart ? new Date(form.scheduledStart).toISOString() : null,
        scheduledEnd: form.scheduledEnd ? new Date(form.scheduledEnd).toISOString() : null,
      });
      const liveEventId = (resp.data as any)?.liveEventId as string | undefined;
      if (!liveEventId) throw new Error("Missing liveEventId");

      const evSnap = await getDoc(doc(db, "liveEvents", liveEventId));
      if (evSnap.exists()) {
        const ev = { id: evSnap.id, ...(evSnap.data() as any) } as LiveEvent;
        setEvents((prev) => [ev, ...prev]);
        setSelectedEventId(ev.id);
      }
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.code === "functions/failed-precondition"
          ? "Cloudflare Stream is not configured yet. Add env vars in Functions before creating live inputs."
          : "Unable to create live broadcast. Check Cloudflare config and permissions.";
      setError(msg);
    } finally {
      setCreating(false);
    }
  };


  const setStatus = async (id: string, status: LiveEvent["status"]) => {
    setStatusSaving(id);
    try {
      await updateDoc(doc(db, "liveEvents", id), { status, updatedAt: serverTimestamp() });
      setEvents((prev) => prev.map((e) => (e.id === id ? ({ ...e, status } as any) : e)));
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    } finally {
      setStatusSaving(null);
    }
  };

  const disable = async (id: string) => {
    if (!confirm("Disable this live input? This will stop future streaming for this event.")) return;
    setStatusSaving(id);
    try {
      await callables.cloudflareDisableLiveInput({ liveEventId: id });
      await setStatus(id, "disabled");
    } catch (e: any) {
      console.error(e);
      alert("Failed to disable live input.");
    } finally {
      setStatusSaving(null);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <RoleGuard allowedRoles={["owner", "admin", "channel_owner"]}>
      <DashboardShell navItems={navItems} channelName="Go Live">
        {loading ? (
          <div className="h-[360px] rounded-2xl bg-surface-container-high animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 space-y-8">
              <div className="glass-panel rounded-3xl border-white/5 p-10">
                <div className="flex items-end justify-between gap-6 mb-10">
                  <div>
                    <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Live Broadcast</h1>
                    <p className="text-on-surface-variant text-sm">Create a live input for OBS and manage your broadcast status.</p>
                  </div>
                  <button
                    onClick={createLive}
                    disabled={creating || !selectedChannelId || !form.title.trim()}
                    className="bg-primary text-on-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {creating ? "Creating..." : "Create Live Broadcast"}
                  </button>
                </div>

                {error && (
                  <div className="mb-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Channel</p>
                    <select
                      value={selectedChannelId}
                      onChange={(e) => setSelectedChannelId(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {channels.map((c) => (
                        <option key={c.id} value={c.id} className="bg-surface text-on-surface">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Title</p>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Live event title"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Description</p>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      placeholder="What is this broadcast?"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Scheduled Start</p>
                    <input
                      type="datetime-local"
                      value={form.scheduledStart}
                      onChange={(e) => setForm((p) => ({ ...p, scheduledStart: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Scheduled End</p>
                    <input
                      type="datetime-local"
                      value={form.scheduledEnd}
                      onChange={(e) => setForm((p) => ({ ...p, scheduledEnd: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-white/5 outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              {selectedEvent && (
                <div className="glass-panel rounded-3xl border-white/5 p-10">
                  <div className="flex items-end justify-between gap-6 mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">OBS Setup</p>
                      <h2 className="text-3xl font-headlines font-black italic">{selectedEvent.title}</h2>
                      <p className="text-on-surface-variant text-sm mt-2">Provider: {selectedEvent.provider} • Playback ID: {selectedEvent.playbackId || "—"}</p>
                    </div>
                    <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-surface-container-high border border-white/10 text-on-surface-variant">
                      {selectedEvent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-surface-container-low border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-3">RTMPS Ingest URL</p>
                      <p className="text-sm text-on-surface break-all">{secrets?.ingestUrl || "Not available (permissions or not created yet)."}</p>
                      <button
                        onClick={() => secrets?.ingestUrl && copy(secrets.ingestUrl)}
                        disabled={!secrets?.ingestUrl}
                        className="mt-4 px-5 py-3 rounded-xl bg-surface-container-high border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-50"
                      >
                        Copy Ingest URL
                      </button>
                    </div>
                    <div className="p-6 rounded-2xl bg-surface-container-low border border-white/5">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Stream Key</p>
                        <button
                          onClick={() => setShowKey((v) => !v)}
                          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          {showKey ? "Hide" : "Show"}
                        </button>
                      </div>
                      <p className="text-sm text-on-surface break-all">
                        {!secrets?.streamKey ? "Not available (permissions or not created yet)." : showKey ? secrets.streamKey : "••••••••••••••••••••••••••••"}
                      </p>
                      <button
                        onClick={() => secrets?.streamKey && copy(secrets.streamKey)}
                        disabled={!secrets?.streamKey}
                        className="mt-4 px-5 py-3 rounded-xl bg-surface-container-high border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-50"
                      >
                        Copy Stream Key
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 p-8 rounded-2xl bg-surface-container-low border border-dashed border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">OBS Instructions</p>
                    <ol className="space-y-2 text-sm text-on-surface-variant">
                      <li>1. Open OBS Studio</li>
                      <li>2. Go to Settings &gt; Stream</li>
                      <li>3. Choose Custom</li>
                      <li>4. Paste the RTMPS ingest URL</li>
                      <li>5. Paste the Stream Key</li>
                      <li>6. Click Apply</li>
                      <li>7. Click Start Streaming</li>
                    </ol>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <button
                      disabled={statusSaving === selectedEvent.id}
                      onClick={() => setStatus(selectedEvent.id, "live")}
                      className="px-6 py-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      Mark as Live
                    </button>
                    <button
                      disabled={statusSaving === selectedEvent.id}
                      onClick={() => setStatus(selectedEvent.id, "ended")}
                      className="px-6 py-4 rounded-xl bg-white/5 text-on-surface border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      Mark as Ended
                    </button>
                    <button
                      disabled={statusSaving === selectedEvent.id}
                      onClick={() => disable(selectedEvent.id)}
                      className="px-6 py-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      Disable Live Input
                    </button>
                  </div>
                </div>
              )}
            </section>

            <aside className="space-y-8">
              <div className="glass-panel rounded-3xl border-white/5 p-8">
                <h3 className="text-2xl font-headlines font-black italic mb-6">Live Events</h3>
                {events.length === 0 ? (
                  <div className="p-10 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
                    No live events yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.slice(0, 25).map((e) => {
                      const channel = channels.find((c) => c.id === e.channelId);
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelectedEventId(e.id)}
                          className={`w-full text-left p-5 rounded-2xl border transition-all ${
                            selectedEventId === e.id ? "border-primary/40 bg-primary/10" : "border-white/5 bg-surface-container-low hover:bg-white/5"
                          }`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">{channel?.name || e.channelId}</p>
                          <p className="font-bold text-white truncate">{e.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-2">
                            {e.status} • {e.provider}
                          </p>
                          <p className="text-[10px] text-on-surface-variant mt-1">Playback ID: {e.playbackId || "—"}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </DashboardShell>
    </RoleGuard>
  );
}
