'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Channels", href: "/admin/channels" },
  { label: "Content", href: "/admin/content" },
  { label: "Ads", href: "/admin/ads" },
  { label: "Ledger", href: "/admin/ledger" },
  { label: "Users", href: "/admin/users" },
];

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={['admin', 'owner']}>
      <DashboardShell 
        navItems={adminNavItems} 
        userName="Admin Base" 
        channelName="Network Admin"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDB7lYc5v7R9Q9S1zX-Wz-L-P-N-M-P-Q-R-S-T-U-V-W-X-Y-Z"
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
          <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all border border-white/5">
            <span className="material-symbols-outlined">settings_suggest</span>
            SYSTEM CONFIG
          </button>
          <button className="bg-secondary-container text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/20">
            <span className="material-symbols-outlined">emergency_home</span>
            BROADCAST ALERT
          </button>
        </div>
      </header>

      {/* Network KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Global Audience", value: "8.4M", trend: "+12.5%", icon: "groups" },
          { label: "Network Revenue", value: "$482.1K", trend: "+8.2%", icon: "account_balance_wallet" },
          { label: "Active Channels", value: "142", trend: "3 Pending", icon: "hub" },
          { label: "Ad Inventory", value: "94.2%", trend: "-0.5%", icon: "ads_click" },
        ].map((kpi, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">{kpi.icon}</span>
              </div>
              <span className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">{kpi.trend}</span>
            </div>
            <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.25em] mb-2">{kpi.label}</p>
            <h3 className="text-4xl font-headlines font-black">{kpi.value}</h3>
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
                <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full text-[10px] font-black tracking-widest">12 URGENT</span>
                <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { title: "The New Renaissance: Ep 1", owner: "Marcus / Urban Echoes", date: "15m ago", type: "Episode" },
                { title: "HBCU Classic: Live Stream", owner: "CSD / Sports Desk", date: "1h ago", type: "Live Event" },
                { title: "Modern Motown Docu-series", owner: "Soul Stage", date: "3h ago", type: "Series" },
                { title: "News at 10 (Daily)", owner: "CN News", date: "4h ago", type: "Daily" },
              ].map((item, i) => (
                <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-12 rounded bg-surface-container-highest overflow-hidden ring-1 ring-white/10"></div>
                    <div>
                      <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant font-medium mt-1">
                        Channel: <span className="text-on-surface">{item.owner}</span> • {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mr-4">{item.date}</p>
                    <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                      <span className="material-symbols-outlined">check_circle</span>
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <span className="material-symbols-outlined">cancel</span>
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-on-surface-variant hover:bg-white/10 transition-all">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>
              ))}
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
                  <p className="text-xs text-on-surface-variant font-medium mb-1">Unallocated Revenue</p>
                  <p className="text-2xl font-headlines font-black">$124,500.00</p>
                </div>
                <button className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline">Settle All</button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Ad Revenue (Platform Share)</span>
                  <span className="font-bold text-green-500">+$82.4K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Creator Payouts (Reserved)</span>
                  <span className="font-bold text-red-400">-$210.2K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Operational Costs</span>
                  <span className="font-bold text-on-surface">-$12.1K</span>
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
