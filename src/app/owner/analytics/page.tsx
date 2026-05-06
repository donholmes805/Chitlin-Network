'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";

import { analyticsService } from "@/lib/firebase/analytics";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

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

export default function OwnerAnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      try {
        const data = await analyticsService.getOwnerStats(user.email);
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName="Analytics">
        <div className="space-y-8">
          <div className="glass-panel rounded-3xl border-white/5 p-12">
            <h1 className="text-4xl font-headlines font-black italic mb-4">Analytics</h1>
            <p className="text-on-surface-variant text-sm max-w-3xl">
              Performance metrics for your channel content and ad distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Shows", value: stats?.showsCount || 0 },
              { icon: "movie", label: "Total Episodes", value: stats?.episodesCount || 0 },
              { icon: "schedule", label: "Active Schedules", value: stats?.activeSchedules || 0 },
              { icon: "monetization_on", label: "Net Earnings", value: `$${(stats?.revenue.channelShare || 0).toLocaleString()}` },
            ].map((s, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-4">{s.label}</p>
                <h3 className="text-4xl font-headlines font-black">{loading ? "..." : s.value}</h3>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-3xl border-white/5 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-white/10 mb-4">analytics</span>
            <p className="text-on-surface-variant text-sm">
              Time-series viewership charts and audience demographic data will be available in the next platform update.
            </p>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}

