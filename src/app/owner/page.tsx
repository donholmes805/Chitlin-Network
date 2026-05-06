'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Channel } from "@/types";

const navItems = [
  { label: "Overview", href: "/owner" },
  { label: "Channel Profile", href: "/owner/channel" },
  { label: "Shows", href: "/owner/shows" },
  { label: "Schedule", href: "/owner/schedule" },
  { label: "Analytics", href: "/owner/analytics" },
  { label: "Revenue", href: "/owner/revenue" },
];

export default function OwnerOverview() {
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkChannel() {
      if (!user) return;
      try {
        const q = query(collection(db, 'channels'), where('ownerId', '==', user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setChannel({ id: snap.docs[0].id, ...snap.docs[0].data() } as Channel);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkChannel();
  }, [user]);

  return (
    <RoleGuard allowedRoles={['channel_owner', 'owner']}>
      <DashboardShell 
        navItems={navItems} 
        channelName={channel?.name || "No Channel"}
      >
        {!loading && !channel ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20">
              <span className="material-symbols-outlined text-6xl">broadcast_on_home</span>
            </div>
            <h2 className="text-4xl font-headlines font-black text-white mb-4 italic">Start Your Broadcast Legacy</h2>
            <p className="text-on-surface-variant max-w-xl mb-12 text-lg">
              You haven't set up a channel yet. Apply now to start your independent network on Chitlin’ Network.
            </p>
            <button className="bg-primary text-on-primary px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all">
              CREATE CHANNEL PROFILE
            </button>
          </div>
        ) : (
          <>
            {/* Existing Dashboard Content */}
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-headlines font-bold text-on-surface mb-2">Hello, Marcus</h1>
          <p className="text-on-surface-variant text-lg">
            Your channel <span className="text-primary font-bold">"Urban Echoes"</span> has grown <span className="text-secondary-container font-bold">12%</span> this week. Great job!
          </p>
        </div>
        <button className="bg-primary text-on-primary px-10 py-5 rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl border-none ring-offset-2 ring-offset-background focus:ring-2 ring-primary">
          <span className="material-symbols-outlined text-2xl">add_circle</span>
          CREATE NEW SHOW
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {[
          { icon: "visibility", label: "Total Views", value: "1.2M", trend: "+5.2%" },
          { icon: "schedule", label: "Watch Hours", value: "45.8K", trend: "+2.1%" },
          { icon: "live_tv", label: "Active Shows", value: "12", trend: "Stable" },
          { icon: "payments", label: "Estimated Revenue", value: "$14,250", trend: "Trending", highlight: true },
          { icon: "event", label: "Next Payout", value: "Oct 25", trend: "Pending" },
        ].map((kpi, i) => (
          <div key={i} className={`glass-panel p-8 rounded-2xl border-white/5 transition-all hover:border-primary/30 group ${kpi.highlight ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <span className={`material-symbols-outlined text-3xl ${kpi.highlight ? 'text-primary' : 'text-primary/70'}`}>{kpi.icon}</span>
              <span className="text-primary text-[10px] font-black uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">{kpi.trend}</span>
            </div>
            <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <h3 className={`text-3xl font-headlines font-black ${kpi.highlight ? 'text-primary' : ''}`}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column Left: Recent Uploads */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-panel rounded-2xl overflow-hidden border-white/5">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
              <h2 className="text-2xl font-headlines font-bold">Recent Uploads</h2>
              <button className="text-primary font-bold text-sm hover:underline tracking-widest uppercase">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high/30 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Show Title</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Views</th>
                    <th className="px-8 py-5 text-right">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { title: "Midnight Jazz Session #4", status: "LIVE", views: "24.5K", date: "2h ago", color: "bg-secondary-container" },
                    { title: "Behind The Lens: Episode 2", status: "PENDING", views: "0", date: "Oct 12", color: "bg-surface-container-highest" },
                    { title: "Summer Festival Highlights", status: "REJECTED", views: "0", date: "Oct 10", color: "bg-red-900/50" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg bg-surface-container-highest overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                          <div className="w-full h-full bg-gradient-to-br from-surface-container-highest to-surface-dim"></div>
                        </div>
                        <span className="font-bold text-sm">{row.title}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          <span className={`${row.color} text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-full flex items-center gap-2 w-fit ring-1 ring-white/10`}>
                            {row.status === "LIVE" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                            {row.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right text-on-surface-variant font-medium text-sm">{row.views}</td>
                      <td className="px-8 py-5 text-right text-on-surface-variant font-medium text-sm">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Analytics Sneak-peek */}
          <section className="glass-panel rounded-2xl p-8 border-white/5">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-headlines font-bold">7-Day Viewership</h2>
              <select className="bg-surface-container-highest border-none rounded-lg text-[10px] font-black uppercase tracking-widest py-2 pl-4 pr-10 focus:ring-1 focus:ring-primary">
                <option>Views</option>
                <option>Watch Time</option>
              </select>
            </div>
            <div className="h-48 w-full flex items-end gap-3 px-4">
              {[40, 60, 35, 85, 70, 55, 95].map((h, i) => (
                <div key={i} className="flex-grow flex flex-col items-center group/bar cursor-pointer">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-500 relative ${i === 6 ? 'bg-primary' : 'bg-primary/10 group-hover/bar:bg-primary/40'}`} 
                    style={{ height: `${h}%` }}
                  >
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-surface-bright border border-primary/20 py-1 px-2 rounded text-[10px] font-black text-primary shadow-xl transition-all">
                      {Math.floor(h * 1.2)}K
                    </span>
                  </div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main Column Right */}
        <div className="space-y-8">
          {/* Payout Status */}
          <section className="glass-panel rounded-2xl p-8 border-l-8 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-primary">Payout Milestone</h3>
            <div className="flex items-end justify-between mb-3">
              <span className="text-3xl font-headlines font-black">$14,250</span>
              <span className="text-primary font-black text-xl">71%</span>
            </div>
            <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden mb-6 ring-1 ring-white/5 p-1">
              <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]" style={{ width: '71%' }}></div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Threshold: <span className="text-on-surface font-bold">$20,000</span>. Approx. <span className="text-primary font-bold">$5,750</span> remaining until next disbursement.
            </p>
          </section>

          {/* Audience Activity */}
          <section className="glass-panel rounded-2xl p-8 border-white/5">
            <h3 className="text-2xl font-headlines font-bold mb-8">Audience Activity</h3>
            <div className="space-y-6">
              {[
                { icon: "chat", label: "New Comment", text: '"Loving the new series!" - @user123', color: "text-primary", bg: "bg-primary/10" },
                { icon: "favorite", label: "Viral Milestone", text: 'Your video hit 10k likes!', color: "text-secondary-container", bg: "bg-secondary-container/10" },
                { icon: "share", label: "Trending Update", text: 'Shared 450 times on Twitter.', color: "text-tertiary-container", bg: "bg-tertiary-container/10" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-6 p-4 hover:bg-white/[0.03] rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-white/5">
                  <div className={`w-14 h-14 rounded-2xl ${activity.bg} flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-2xl">{activity.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1">{activity.label}</p>
                    <p className="text-sm text-on-surface-variant font-medium">{activity.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Creator Tip */}
          <section className="glass-panel rounded-2xl overflow-hidden border-white/5 group">
            <div className="h-40 bg-gradient-to-br from-surface-container-highest to-surface-dim relative flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-white/5 group-hover:scale-110 group-hover:text-primary/10 transition-all duration-700">lightbulb</span>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
            </div>
            <div className="p-8">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Creator Tip</h3>
              <h4 className="text-2xl font-headlines font-bold mb-4">Maximize Your Ad Revenue</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                Learn how to strategically place mid-rolls in 15+ minute content for 30% higher CPMs.
              </p>
              <button className="w-full py-4 rounded-xl border-2 border-primary/20 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary/10 hover:border-primary transition-all">
                READ STRATEGY GUIDE
              </button>
            </div>
          </section>
        </div>
      </div>
          </>
        )}
      </DashboardShell>
    </RoleGuard>
  );
}
