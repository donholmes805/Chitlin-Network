'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import type { Channel, Schedule } from "@/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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

function toDate(value: any): Date | null {
  return value?.toDate?.() ?? null;
}

export default function OwnerSchedulePage() {
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
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

        const sSnap = await getDocs(
          query(collection(db, "schedules"), where("channelId", "==", ch.id), orderBy("startTime", "asc"))
        );
        setSchedule(sSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Schedule[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.email]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return schedule
      .map((s) => ({ ...s, _start: toDate(s.startTime), _end: toDate(s.endTime) }))
      .filter((s: any) => s._start && s._end && s._end >= now)
      .slice(0, 30);
  }, [schedule]);

  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName={channel?.name || "Schedule"}>
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
                <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Schedule</h1>
                <p className="text-on-surface-variant text-sm">Viewing schedule blocks for your channel. Editing UI will be added next.</p>
              </div>
              <button className="bg-surface-container-high px-8 py-4 rounded-xl border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                Add Block (Soon)
              </button>
            </div>

            {upcoming.length === 0 ? (
              <div className="p-14 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
                No schedule blocks yet.
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between gap-6 p-6 rounded-2xl bg-surface-container-low border border-white/5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">
                        {s._start.toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })} —{" "}
                        {s._end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </p>
                      <h3 className="font-bold text-white truncate">{s.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{s.description}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant shrink-0">{s.status}</span>
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

