'use client';

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }
    if (role === 'owner' || role === 'admin') {
      router.push('/admin');
      return;
    }
    if (role === 'channel_owner' || role === 'viewer') {
      router.push('/owner');
      return;
    }
    router.push('/');
  }, [loading, role, router, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

