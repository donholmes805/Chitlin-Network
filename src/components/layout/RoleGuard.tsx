'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/auth/signin' 
}: RoleGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(fallbackPath);
      } else if (role && !allowedRoles.includes(role)) {
        // Owners can access everything
        if (role !== 'owner') {
          router.push('/');
        }
      }
    }
  }, [user, role, loading, allowedRoles, router, fallbackPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-black uppercase tracking-[0.3em] text-xs animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If loading is done and we have the right role, or if user is the owner
  const isAllowed = user && (role === 'owner' || (role && allowedRoles.includes(role)));

  if (!isAllowed) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
