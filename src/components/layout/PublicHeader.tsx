'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PublicHeader() {
  const pathname = usePathname();
  const { user, signInWithGoogle, logout, role } = useAuth();

  const navLinks = [
    { name: 'Watch Live', href: '/watch-live' },
    { name: 'Guide', href: '/guide' },
    { name: 'Channels', href: '/channels' },
    { name: 'Shows', href: '/shows' },
    { name: 'Advertise', href: '/advertise' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <nav className="safe-area flex justify-between items-center py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-headlines font-black italic tracking-tighter text-primary cursor-pointer hover:scale-105 transition-transform inline-block">
            Chitlin’ Network
          </Link>
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`font-semibold transition-all duration-300 hover:text-primary hover:scale-105 ${
                  pathname === link.href ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            search
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface leading-none">{user.displayName?.split(' ')[0]}</p>
                <p className="text-[8px] font-black uppercase tracking-tighter text-primary mt-1">{role}</p>
              </div>
              <div className="relative group">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || ''} 
                  className="w-9 h-9 rounded-full border-2 border-primary cursor-pointer hover:ring-4 ring-primary/20 transition-all"
                />
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50 border border-white/10">
                  <Link href="/owner" className="block px-4 py-2 text-xs font-bold hover:bg-primary/10 hover:text-primary transition-colors uppercase tracking-widest">
                    Creator Dashboard
                  </Link>
                  {role === 'owner' && (
                    <Link href="/admin" className="block px-4 py-2 text-xs font-bold hover:bg-primary/10 hover:text-primary transition-colors uppercase tracking-widest">
                      Network Admin
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-colors uppercase tracking-widest border-t border-white/5 mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-primary text-on-primary px-6 py-2 rounded font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
