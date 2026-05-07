'use client';

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import { db } from "@/lib/firebase/config";
import { Channel, Schedule, Show } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

function toDate(value: any): Date | null {
  return value?.toDate?.() ?? null;
}

export default function ChannelClient() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!channelId) return;
      setLoading(true);
      try {
        const chDoc = await getDoc(doc(db, 'channels', channelId as string));
        if (!chDoc.exists()) {
          setChannel(null);
          return;
        }
        const ch = { id: chDoc.id, ...(chDoc.data() as any) } as Channel;
        setChannel(ch);

        const [showSnap, schedSnap] = await Promise.all([
          getDocs(query(collection(db, 'shows'), where('channelId', '==', ch.id), where('status', '==', 'approved'))),
          getDocs(query(collection(db, 'schedules'), where('channelId', '==', ch.id), where('status', '==', 'approved'), orderBy('startTime', 'asc'))),
        ]);

        setShows(showSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Show[]);
        setSchedule(schedSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Schedule[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [channelId]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return schedule
      .map((s) => ({ ...s, _start: toDate(s.startTime), _end: toDate(s.endTime) }))
      .filter((s: any) => s._start && s._start >= now)
      .slice(0, 6);
  }, [schedule]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicHeader />
        <main className="flex-grow flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-4xl font-headlines font-black mb-4 italic">Channel Not Found</h1>
            <p className="text-on-surface-variant mb-10">This network may have been moved or is unavailable.</p>
            <Link href="/channels" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs">
              Back to Directory
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <PublicHeader />

      <section className="relative h-[55vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={channel.bannerUrl} className="w-full h-full object-cover opacity-35" alt={channel.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="absolute inset-0 safe-area flex flex-col justify-end pb-16">
          <div className="flex flex-col md:flex-row md:items-end gap-10">
            <div className="w-28 h-28 md:w-36 md:h-36 overflow-hidden feather-mask-all shrink-0">
              <img src={channel.logoUrl} className="w-full h-full object-cover" alt={channel.name} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-primary/90 text-on-primary px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase">{channel.category}</span>
                {channel.liveNow && (
                  <span className="animate-live-pulse bg-secondary-container text-white text-[10px] px-3 py-1 rounded font-black tracking-widest uppercase">
                    Live Now
                  </span>
                )}
                {channel.featured && (
                  <span className="bg-surface-container-high text-primary text-[10px] px-3 py-1 rounded font-black tracking-widest uppercase border border-primary/20">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-8xl font-headlines font-black italic tracking-tighter leading-none mb-6">{channel.name}</h1>
              <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">{channel.description}</p>
              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/watch-live" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
                  Watch Live
                </Link>
                <button className="bg-surface-container-high px-10 py-4 rounded-xl border border-white/5 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                  Follow Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="safe-area py-20 space-y-16 flex-grow">
        <section className="glass-panel rounded-2xl p-8 border-white/5">
          <h2 className="text-2xl font-headlines font-black italic mb-8">Shows</h2>
          {shows.length === 0 ? (
            <div className="text-on-surface-variant text-sm">No approved shows yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {shows.map((s) => (
                <Link key={s.id} href={`/shows/${s.id}`} className="group">
                  <div className="relative h-[220px] overflow-hidden feather-mask-all">
                    <img src={s.bannerUrl || s.posterUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt={s.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-2xl font-headlines font-black text-white group-hover:text-primary transition-colors">{s.title}</h3>
                      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">{s.rating}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-2xl p-8 border-white/5">
          <h2 className="text-2xl font-headlines font-black italic mb-8">Upcoming Schedule</h2>
          {upcoming.length === 0 ? (
            <div className="text-on-surface-variant text-sm">No upcoming programming scheduled.</div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between gap-6 p-5 rounded-2xl bg-surface-container-low border border-white/5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">
                      {s._start.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })} — {s._end?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <h3 className="font-bold text-white truncate">{s.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{s.description}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant shrink-0">{s.programType}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-2xl p-8 border-white/5">
          <h2 className="text-2xl font-headlines font-black italic mb-6">Sponsored</h2>
          <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-white/10 text-center text-on-surface-variant">
            Sponsored placements will appear here.
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
