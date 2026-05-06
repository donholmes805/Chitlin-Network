'use client';

import { Channel, ProgramType, Schedule } from "@/types";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Program {
  title: string;
  startTime: string; 
  endTime: string; 
  type: ProgramType;
  span: number; 
  isLive?: boolean;
  progress?: number;
}

interface ChannelSchedule {
  channelId: string;
  channelName: string;
  channelLogoUrl?: string;
  logoBg: string; 
  programs: Program[];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function startOfHalfHour(date: Date) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - (d.getMinutes() % 30));
  return d;
}

export default function ProgramGuide() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [programsByChannel, setProgramsByChannel] = useState<Record<string, Schedule[]>>({});
  const [loading, setLoading] = useState(true);

  const windowStart = useMemo(() => startOfHalfHour(new Date()), []);
  const windowEnd = useMemo(() => new Date(windowStart.getTime() + 3 * 60 * 60 * 1000), [windowStart]);

  const timeSlots = useMemo(() => {
    const slots: Date[] = [];
    for (let i = 0; i < 6; i++) slots.push(new Date(windowStart.getTime() + i * 30 * 60 * 1000));
    return slots;
  }, [windowStart]);

  useEffect(() => {
    async function loadGuide() {
      try {
        const chSnap = await getDocs(query(collection(db, 'channels'), where('status', '==', 'approved')));
        const ch = chSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Channel[];
        setChannels(ch);

        const schedulesSnap = await getDocs(
          query(
            collection(db, 'schedules'),
            where('status', '==', 'approved'),
            orderBy('startTime', 'asc')
          )
        );
        const schedules = schedulesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Schedule[];

        const grouped: Record<string, Schedule[]> = {};
        for (const s of schedules) {
          const start = (s.startTime as any)?.toDate?.() as Date | undefined;
          if (!start) continue;
          if (start < windowStart || start > windowEnd) continue;
          grouped[s.channelId] ??= [];
          grouped[s.channelId].push(s);
        }
        setProgramsByChannel(grouped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadGuide();
  }, [windowEnd, windowStart]);

  const guideRows: ChannelSchedule[] = useMemo(() => {
    const palette = ['bg-primary-container', 'bg-secondary-container', 'bg-surface-container-high', 'bg-surface-variant'];
    return channels.map((c, idx) => {
      const schedules = programsByChannel[c.id] ?? [];
      const programs: Program[] = schedules.map((s) => {
        const start = (s.startTime as any)?.toDate?.() as Date | undefined;
        const end = (s.endTime as any)?.toDate?.() as Date | undefined;
        const durationMinutes = start && end ? Math.max(30, Math.round((end.getTime() - start.getTime()) / 60000)) : 30;
        const span = Math.min(6, Math.max(1, Math.round(durationMinutes / 30)));
        const now = new Date();
        const isLive = Boolean(start && end && now >= start && now < end);
        const progress = isLive && start && end ? Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100) : undefined;
        return {
          title: s.title,
          startTime: start ? formatTime(start) : '',
          endTime: end ? formatTime(end) : '',
          type: s.programType,
          span,
          isLive,
          progress,
        };
      });
      return {
        channelId: c.id,
        channelName: c.name,
        channelLogoUrl: c.logoUrl,
        logoBg: palette[idx % palette.length]!,
        programs,
      };
    });
  }, [channels, programsByChannel]);

  return (
    <div className="relative rounded-[2.5rem] border border-outline-variant bg-surface-container-lowest overflow-x-auto scrollbar-hide shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
      {/* Time Header */}
      <div className="flex bg-surface-container-highest/80 backdrop-blur-xl border-b border-outline-variant sticky top-0 z-30">
        <div className="min-w-[280px] p-6 border-r border-outline-variant sticky left-0 z-40 bg-surface-container-highest">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Broadcast Map</span>
        </div>
        {timeSlots.map((t, i) => (
          <div key={i} className="min-w-[320px] p-6 flex items-center justify-center border-r border-outline-variant text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
            {formatTime(t)}
          </div>
        ))}
      </div>

      {/* Grid Rows */}
      <div className="flex flex-col min-w-max">
        {loading ? (
          <div className="p-24 text-center">
             <div className="inline-flex items-center gap-4 animate-pulse">
                <span className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Synchronizing Schedule...</p>
             </div>
          </div>
        ) : guideRows.length === 0 ? (
          <div className="p-24 text-center">
             <p className="text-on-surface-variant text-sm font-medium">No live transmissions scheduled for this window.</p>
          </div>
        ) : guideRows.map((channel, i) => (
          <div key={i} className="flex border-b border-white/5 hover:bg-white/5 transition-colors group">
            {/* Channel Cell */}
            <div className="min-w-[280px] p-6 flex items-center gap-6 border-r border-outline-variant bg-surface-container-lowest sticky left-0 z-20 group-hover:bg-surface-container-high transition-all duration-500">
               <div className={cn(
                  "w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-on-primary font-black text-[10px] text-center leading-tight shadow-xl group-hover:scale-110 transition-transform",
                  channel.logoBg || "bg-primary"
                )}>
                  {channel.channelLogoUrl ? (
                    <img src={channel.channelLogoUrl} className="w-full h-full object-cover" alt={channel.channelName} />
                  ) : (
                    channel.channelName.split(' ').slice(0, 2).map((word, j) => <div key={j}>{word}</div>)
                  )}
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-sm font-black uppercase tracking-widest text-white leading-none">{channel.channelName}</span>
                  <span className="text-[8px] font-bold text-primary uppercase tracking-tighter">Verified Network</span>
               </div>
            </div>

            {/* Programs Sequence */}
            <div className="flex flex-grow items-stretch">
              {channel.programs.map((program, j) => (
                <div 
                  key={j} 
                  className="p-2 transition-all duration-500" 
                  style={{ minWidth: `${program.span * 320}px` }}
                >
                  <div className={cn(
                    "h-full w-full rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden transition-all border group/program",
                    program.isLive 
                      ? "bg-surface-container-high border-primary/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer hover:border-primary" 
                      : "bg-surface-container-low border-white/5 opacity-40 hover:opacity-100 hover:border-white/20 cursor-default"
                  )}>
                    {program.isLive && (
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="flex h-2 w-2 relative">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Live Now</span>
                      </div>
                    )}
                    <h4 className="text-sm md:text-base font-black text-white italic tracking-tight group-hover/program:text-primary transition-colors truncate">
                      {program.title}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                      {program.startTime} — {program.endTime}
                    </p>
                    
                    {program.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_10px_rgba(242,202,80,0.5)]" style={{ width: `${program.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
