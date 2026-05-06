'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { analyticsService } from "@/lib/firebase/analytics";
import { seedPlatformData } from "@/lib/firebase/seed";
import { useAuth } from "@/context/AuthContext";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "System Check", href: "/admin/system-check" },
];

export default function AdminDashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [adminStats, activity] = await Promise.all([
          analyticsService.getAdminStats(),
          analyticsService.getRecentActivity(5)
        ]);
        setStats(adminStats);
        setRecentActivity(activity);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSeed = async () => {
    if (!confirm("Start Network Genesis? This will add launch data to Firestore.")) return;
    setSeeding(true);
    try {
      await seedPlatformData();
      alert("Genesis Complete! Refreshing...");
      window.location.reload();
    } catch (e) {
      alert("Error seeding data. Check console.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'owner']}>
      <DashboardShell 
        navItems={adminNavItems} 
        userName="Network Admin" 
        channelName="Command Center"
      >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-headlines font-bold text-on-surface mb-2 tracking-tighter">Network Control</h1>
          <p className="text-on-surface-variant text-lg">
            System status: <span className="text-green-500 font-bold uppercase tracking-widest text-xs ml-2">Online & Optimal</span>
          </p>
        </div>
        <div className="flex gap-4">
          {role === 'owner' && (
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
            >
              <span className="material-symbols-outlined">{seeding ? 'sync' : 'database'}</span>
              {seeding ? 'SEEDING...' : 'RUN GENESIS SEED'}
            </button>
          )}
          <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all border border-white/5">
            <span className="material-symbols-outlined">settings_suggest</span>
            SYSTEM CONFIG
          </button>
        </div>
      </header>

      {/* Network KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Active Channels", value: stats?.channels.approved.toString() || "0", trend: "Live Platform", icon: "podcasts" },
          { label: "Total Shows", value: stats?.shows.total.toString() || "0", trend: `${stats?.episodes.total || 0} Episodes`, icon: "video_library" },
          { label: "Pending Approvals", value: (stats?.channels.pending + stats?.shows.pending + stats?.episodes.pending).toString() || "0", trend: (stats?.channels.pending + stats?.shows.pending + stats?.episodes.pending) > 0 ? "Action Required" : "All Clear", icon: "pending_actions" },
          { label: "Network Revenue", value: `$${(stats?.revenue.gross || 0).toLocaleString()}`, trend: "Live Tracking", icon: "monetization_on" },
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">{kpi.icon}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${kpi.label === 'Pending Approvals' && parseInt(kpi.value) > 0 ? 'bg-error/10 text-error' : 'bg-primary/5 text-primary'}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.25em] mb-2">{kpi.label}</p>
            <h3 className="text-4xl font-headlines font-black">{loading ? "..." : kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approval Queue */}
        <div className="lg:col-span-2">
          <section className="glass-panel rounded-2xl overflow-hidden border-white/5 h-full">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
              <h2 className="text-2xl font-headlines font-bold">Content Approval Queue</h2>
              <div className="flex gap-4">
                <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                  {((stats?.channels.pending || 0) + (stats?.shows.pending || 0) + (stats?.episodes.pending || 0))} PENDING
                </span>
                <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {recentActivity.length === 0 ? (
                <div className="px-8 py-12 text-center text-on-surface-variant text-sm">No recent activity detected.</div>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-12 rounded bg-surface-container-highest overflow-hidden ring-1 ring-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/20">
                          {item.type === 'show' ? 'video_library' : item.type === 'episode' ? 'movie' : 'payments'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.title || item.advertiserName || "Untitled"}</h4>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          {item.type === 'adOrder' ? `Order: ${item.packageType}` : `Channel: ${item.channelId}`} • {item.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mr-4">
                        {item.date?.toDate?.().toLocaleDateString() || "RECENT"}
                      </p>
                      <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                        <span className="material-symbols-outlined">check_circle</span>
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 text-on-surface-variant hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-surface-container-highest/30 text-center">
              <button className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant hover:text-primary transition-colors">
                Load More Pending Content
              </button>
            </div>
          </section>
        </div>

        {/* Network Ledger Preview */}
        <div className="space-y-8">
          <section className="glass-panel rounded-2xl p-8 border-white/5 bg-gradient-to-br from-surface-container-low to-surface-dim">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-primary">Financial Ledger</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs text-on-surface-variant font-medium mb-1">Total Platform Gross</p>
                  <p className="text-2xl font-headlines font-black">${(stats?.revenue.gross || 0).toLocaleString()}</p>
                </div>
                <button className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline">Settle All</button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Ad Revenue (Platform Share)</span>
                  <span className="font-bold text-green-500">+${(stats?.revenue.platform || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Creator Payouts (Reserved)</span>
                  <span className="font-bold text-red-400">-${(stats?.revenue.owner || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">System Status</span>
                  <span className="font-bold text-on-surface">OPTIMAL</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-10 py-4 rounded-xl bg-primary text-on-primary font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-[1.02] transition-all">
              GENERATE FULL AUDIT
            </button>
          </section>

          {/* Quick Stats */}
          <section className="glass-panel rounded-2xl p-8 border-white/5">
            <h3 className="text-2xl font-headlines font-bold mb-8">System Health</h3>
            <div className="space-y-6">
              {[
                { label: "Cloudflare Stream", status: "Healthy", color: "bg-green-500" },
                { label: "Mux Data API", status: "Healthy", color: "bg-green-500" },
                { label: "Firebase Auth", status: "Degraded", color: "bg-yellow-500" },
                { label: "Firestore DB", status: "Healthy", color: "bg-green-500" },
              ].map((sys, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface-variant">{sys.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest">{sys.status}</span>
                    <span className={`w-2 h-2 rounded-full ${sys.color}`}></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      </DashboardShell>
    </RoleGuard>
  );
}
