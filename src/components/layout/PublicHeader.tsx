'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function PublicHeader() {
  const pathname = usePathname();
  const { user, signInWithGoogle, logout, role } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Watch Live', href: '/watch-live' },
    { name: 'Guide', href: '/guide' },
    { name: 'Directory', href: '/channels' },
    { name: 'Originals', href: '/shows' },
    { name: 'Advertise', href: '/advertise' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        isScrolled ? 'premium-blur border-b border-white/5 py-4' : 'bg-transparent py-8'
      }`}
    >
      <nav className="safe-area flex justify-between items-center">
        <div className="flex items-center gap-16">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl md:text-2xl font-headlines font-black italic tracking-tighter text-primary group-hover:scale-105 transition-transform duration-500">
              CHITLIN’ NETWORK
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:text-primary relative group ${
                  pathname === link.href ? 'text-primary' : 'text-on-surface-variant/70'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-500 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button className="material-symbols-outlined text-on-surface-variant/60 hover:text-primary transition-all duration-500 cursor-pointer text-xl">
            search
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface leading-none">{user.displayName?.split(' ')[0]}</p>
                <p className="text-[7px] font-bold uppercase tracking-widest text-primary mt-1 opacity-80">{role === 'admin' ? 'Network Admin' : 'Creator'}</p>
              </div>
              <div className="relative group">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-primary-container cursor-pointer hover:scale-110 transition-all duration-500">
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`} 
                    alt={user.displayName || ''} 
                    className="w-9 h-9 rounded-full border-2 border-background"
                  />
                </div>
                
                {/* Premium Dropdown — Refined */}
                <div className="absolute right-0 top-full mt-5 w-60 glass-panel rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 overflow-hidden border border-white/5">
                  <div className="px-4 py-4 border-b border-white/5 mb-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Authenticated</p>
                    <p className="text-xs font-bold text-white truncate opacity-90">{user.email}</p>
                  </div>
                  
                  <Link href="/owner" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-all uppercase tracking-widest group/item">
                    <span className="material-symbols-outlined text-lg">dashboard</span>
                    Dashboard
                  </Link>
                  
                  {role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-all uppercase tracking-widest">
                      <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                      Admin
                    </Link>
                  )}
                  
                  <Link href="/membership" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-all uppercase tracking-widest">
                    <span className="material-symbols-outlined text-lg">stars</span>
                    Membership
                  </Link>
                  
                  <div className="h-px bg-white/5 my-2" />
                  
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-black text-secondary hover:bg-secondary/10 transition-all uppercase tracking-widest"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="btn-gold !py-2 !px-7 !text-[10px] !rounded-lg"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
