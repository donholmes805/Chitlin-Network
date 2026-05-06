'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { firebaseService } from "@/lib/firebase/services";
import type { RevenueRecord } from "@/types";
import { useEffect, useState } from "react";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "System Check", href: "/admin/system-check" },
];

export default function AdminRevenuePage() {
  const [records, setRecords] = useState<RevenueRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await firebaseService.getRevenueLedger();
        setRecords(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totals = records.reduce(
    (acc, r) => {
      acc.gross += r.grossAmount || 0;
      acc.platform += r.platformShare || 0;
      acc.owner += r.channelOwnerShare || 0;
      return acc;
    },
    { gross: 0, platform: 0, owner: 0 }
  );

  return (
    <RoleGuard allowedRoles={["admin", "owner"]}>
      <DashboardShell navItems={adminNavItems} userName="Network Admin" channelName="Revenue">
        <div className="space-y-10">
          <div className="glass-panel rounded-3xl border-white/5 p-10">
            <h1 className="text-4xl font-headlines font-black italic tracking-tighter mb-2">Revenue</h1>
            <p className="text-on-surface-variant text-sm">Ledger is admin/owner readable only.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Gross Revenue", value: `$${totals.gross.toFixed(2)}` },
              { label: "Platform Revenue", value: `$${totals.platform.toFixed(2)}` },
              { label: "Owner Revenue", value: `$${totals.owner.toFixed(2)}` },
            ].map((k) => (
              <div key={k.label} className="glass-panel rounded-2xl border-white/5 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2">{k.label}</p>
                <p className="text-3xl font-headlines font-black italic">{k.value}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-3xl border-white/5 p-10">
            {loading ? (
              <div className="h-[240px] rounded-2xl bg-surface-container-high animate-pulse" />
            ) : records.length === 0 ? (
              <div className="p-14 rounded-2xl border border-dashed border-white/10 text-center text-on-surface-variant text-sm">
                No ledger records yet.
              </div>
            ) : (
              <div className="space-y-4">
                {records.slice(0, 50).map((r) => (
                  <div key={r.id} className="p-6 rounded-2xl bg-surface-container-low border border-white/5 flex items-center justify-between gap-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">{r.source}</p>
                      <p className="font-bold text-white truncate">{r.sourceId}</p>
                      <p className="text-xs text-on-surface-variant truncate">Channel: {r.channelId}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-white">${(r.grossAmount || 0).toFixed(2)}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{r.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
