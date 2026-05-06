 'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import VideoPlayer from "@/components/media/VideoPlayer";
import { db } from "@/lib/firebase/config";
import { Channel, LiveEvent, Schedule } from "@/types";
import { collection, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function toDate(value: any): Date | null {
  return value?.toDate?.() ?? null;
}

export default function WatchLive() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [liveEvent, setLiveEvent] = useState<LiveEvent | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Active live event (public safe)
        const liveSnap = await getDocs(query(collection(db, "liveEvents"), where("status", "==", "live"), orderBy("createdAt", "desc"), limit(1)));
        if (!liveSnap.empty) {
          setLiveEvent({ id: liveSnap.docs[0].id, ...(liveSnap.docs[0].data() as any) } as LiveEvent);
        } else {
          setLiveEvent(null);
        }

        const chSnap = await getDocs(query(collection(db, 'channels'), where('status', '==', 'approved')));
        const ch = chSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Channel[];
        setChannels(ch);

        const liveChannelId = liveSnap.empty ? null : (liveSnap.docs[0].data() as any)?.channelId;
        const liveChannel = liveChannelId ? ch.find((c) => c.id === liveChannelId) ?? null : null;
        const fallback = liveChannel ?? ch.find((c) => c.liveNow) ?? ch.find((c) => c.featured) ?? ch[0] ?? null;
        setActiveChannelId(fallback?.id ?? null);

        const schedSnap = await getDocs(
          query(collection(db, 'schedules'), where('status', '==', 'approved'), orderBy('startTime', 'asc'))
        );
        setSchedule(schedSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Schedule[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeChannel = useMemo(() => channels.find((c) => c.id === activeChannelId) ?? null, [channels, activeChannelId]);

  const { nowPlaying, upNext } = useMemo(() => {
    if (!activeChannel) return { nowPlaying: null as any, upNext: [] as any[] };
    const now = new Date();
    const rows = schedule
      .filter((s) => s.channelId === activeChannel.id)
      .map((s) => ({ ...s, _start: toDate(s.startTime), _end: toDate(s.endTime) }))
      .filter((s: any) => s._start && s._end)
      .sort((a: any, b: any) => a._start.getTime() - b._start.getTime());

    const current = rows.find((s: any) => now >= s._start && now < s._end) ?? null;
    const next = rows.filter((s: any) => s._start > now).slice(0, 6);
    return { nowPlaying: current, upNext: next };
  }, [activeChannel, schedule]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-12 safe-area">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
          {/* Main Player Area */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="aspect-video w-full rounded-2xl bg-surface-container-high animate-pulse" />
            ) : (
              <VideoPlayer
                provider={liveEvent?.playbackId ? "cloudflare_stream" : "external"}
                videoUrl={liveEvent?.playbackUrl || activeChannel?.liveStreamUrl || ""}
                videoId={liveEvent?.playbackId || undefined}
                autoPlay={true}
                posterUrl={activeChannel?.bannerUrl}
              />
            )}
            
            <div className="bg-surface-container p-6 rounded-xl border border-white/5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="animate-live-pulse bg-secondary-container text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-widest">LIVE</span>
                    <span className="text-primary font-bold text-sm tracking-widest uppercase">{activeChannel?.name || 'Live Channel'}</span>
                  </div>
                  <h1 className="text-3xl font-headlines font-bold italic">
                    {liveEvent?.status === "live"
                      ? liveEvent.title
                      : nowPlaying?.title || "Live Stream Coming Soon"}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">share</span>
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    <span>Watchlist</span>
                  </button>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed max-w-3xl">
                {liveEvent?.status === "live"
                  ? liveEvent.description || "Live broadcast in progress."
                  : nowPlaying?.description || "We’re preparing the broadcast feed. Check back soon."}
              </p>
            </div>
          </div>

          {/* Sidebar - Up Next / Guide */}
          <div className="space-y-6">
            <div className="bg-surface-container-high rounded-xl border border-white/5 p-6 h-full">
              <h2 className="text-xl font-headlines mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Up Next
              </h2>

              {/* Channel Switcher */}
              <div className="flex flex-wrap gap-2 mb-8">
                {channels.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveChannelId(c.id)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      c.id === activeChannelId
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container border-white/5 text-on-surface hover:border-primary/50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              
              <div className="space-y-6">
                {upNext.length > 0 ? upNext.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-xs text-primary font-bold tracking-widest mb-1">
                      {(toDate(item.startTime) || new Date()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-on-surface-variant uppercase">{activeChannel?.name}</p>
                  </div>
                )) : (
                  <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center">
                    <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">No upcoming blocks</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-6 border-t border-white/10">
                <Link href="/guide" className="block text-center w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:scale-105 transition-all">
                  Open Program Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
