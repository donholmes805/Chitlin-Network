'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName?: string;
  userImage?: string;
  channelName?: string;
}

export default function DashboardShell({
  children,
  navItems,
  userName = "Marcus",
  userImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAqtiEMDyt6IK425sCDJG29lvK3jvtrnVYZUlw6SnYkalJgv_QzJoOD38u5xek0RlYvvZP8gfQWedxzPIu4GY8aRPo_faxJ0mkEt9iE8Q59l45ptR0Te8GH1CxcE81mMO3K1mf1cKWp5VFp7IUb6uLa9pF9XpXbfkqusoMYQDX7297I0S7ZiWDRA2jykKP59PMortlDfkSNEaizI4eY4VFZDbXcE1BjgHhicTbKiObmCeuo5pr2uyN8oPBzWkRkDJO3Etod9O6ud5U",
  channelName = "Urban Echoes"
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-surface/70 backdrop-blur-2xl border-b border-white/10 px-6 md:px-12 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-headlines font-black text-primary italic tracking-tighter shrink-0">
            Chitlin’ Network
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-bold transition-all border-b-2 pb-1 uppercase tracking-wider",
                    isActive 
                      ? "text-primary border-primary" 
                      : "text-on-surface-variant border-transparent hover:text-on-surface"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center glass-panel rounded-full px-4 py-2 border-white/10">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 placeholder:text-on-surface-variant/50" 
              placeholder="Search analytics..." 
              type="text"
            />
          </div>
          
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">{userName}</p>
              <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">{channelName}</p>
            </div>
            <div className="relative group cursor-pointer">
              <img 
                alt={userName} 
                className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow-lg group-hover:scale-105 transition-transform" 
                src={userImage}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 max-w-[1600px] mx-auto w-full">
        {children}
      </main>

      {/* Dashboard Footer */}
      <footer className="mt-auto border-t border-white/5 bg-surface-container-lowest/50 py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant font-medium">
          © 2024 <span className="text-primary font-bold">Chitlin’ Network</span>. Creator Command Center v1.0.0
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Support</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
