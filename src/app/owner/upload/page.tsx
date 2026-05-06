'use client';

import DashboardShell from "@/components/layout/DashboardShell";
import RoleGuard from "@/components/layout/RoleGuard";

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

export default function OwnerUploadPage() {
  return (
    <RoleGuard allowedRoles={["channel_owner", "owner"]}>
      <DashboardShell navItems={navItems} channelName="Upload Center">
        <div className="glass-panel rounded-3xl border-white/5 p-12">
          <h1 className="text-4xl font-headlines font-black italic mb-4">Upload Center</h1>
          <p className="text-on-surface-variant text-sm max-w-3xl">
            Episode upload + storage workflows are not wired yet in this repo (Firebase Storage is initialized, but no upload UI/actions exist).
            Next phase will add episode creation, file upload, and provider-neutral linking without changing Stitch UI.
          </p>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}

