'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { firebaseService } from "@/lib/firebase/services";
import type { RevenueRecord } from "@/types";
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

export default function OwnerRevenuePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<RevenueRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      setLoading(true);
      try {
        const data = await firebaseService.getRevenueLedger(user.email);
        setRecords(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.email]);

  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName="Revenue">
        <div className="glass-panel rounded-3xl border-white/5 p-10">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Revenue</h1>
              <p className="text-on-surface-variant text-sm">Ledger records are server-owned. Stripe integration will create real entries.</p>
            </div>
          </div>

          {loading ? (
            <div className="h-[200px] rounded-2xl bg-surface-container-high animate-pulse" />
          ) : records.length === 0 ? (
            <div className="p-14 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
              No revenue records yet.
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-surface-container-low border border-white/5 flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">{r.source}</p>
                    <p className="font-bold text-white truncate">{r.sourceId}</p>
                    <p className="text-xs text-on-surface-variant">Gross: ${r.grossAmount} • Platform: ${r.platformShare} • Owner: ${r.channelOwnerShare}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant shrink-0">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}

