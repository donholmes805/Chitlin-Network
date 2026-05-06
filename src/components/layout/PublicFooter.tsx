import Link from 'next/link';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 pt-32 pb-16">
      <div className="safe-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 xl:gap-24 mb-32">
        
        {/* Brand Column — Professional & Soulful */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-headlines font-black text-primary italic tracking-tighter hover:scale-105 transition-transform block w-fit">
              CHITLIN’ NETWORK
            </Link>
            <p className="text-on-surface-variant text-base leading-relaxed max-w-md font-medium">
              Elevating the future of independent Black media through ownership, authentic storytelling, and community-driven broadcasting.
            </p>
          </div>
          
          <div className="flex gap-4">
            {['facebook', 'instagram', 'youtube', 'x'].map((social) => (
              <a key={social} href="#" className="w-11 h-11 rounded-lg bg-surface-container-high border border-white/5 flex items-center justify-center hover:text-primary hover:border-primary/30 transition-all duration-500 group shadow-lg">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100">share</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Links Columns — Investor-Grade Alignment */}
        <div className="lg:col-span-2">
          <h4 className="text-on-surface font-black uppercase tracking-[0.3em] text-[10px] mb-8 opacity-60">Network</h4>
          <ul className="space-y-4 text-on-surface-variant text-[13px] font-bold uppercase tracking-widest">
            <li><Link href="/watch-live" className="hover:text-primary transition-colors">Watch Live</Link></li>
            <li><Link href="/guide" className="hover:text-primary transition-colors">Program Guide</Link></li>
            <li><Link href="/channels" className="hover:text-primary transition-colors">Directory</Link></li>
            <li><Link href="/shows" className="hover:text-primary transition-colors">Originals</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-on-surface font-black uppercase tracking-[0.3em] text-[10px] mb-8 opacity-60">Creators</h4>
          <ul className="space-y-4 text-on-surface-variant text-[13px] font-bold uppercase tracking-widest">
            <li><Link href="/start-a-channel" className="hover:text-primary transition-colors">Partner</Link></li>
            <li><Link href="/advertise" className="hover:text-primary transition-colors">Advertise</Link></li>
            <li><Link href="/membership" className="hover:text-primary transition-colors">Members</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Resources</Link></li>
          </ul>
        </div>

        {/* Newsletter — Clean & Premium */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h4 className="text-on-surface font-black uppercase tracking-[0.3em] text-[10px] mb-6 opacity-60">Newsletter</h4>
            <p className="text-on-surface-variant text-xs font-medium leading-relaxed">Join the network for exclusive premieres and industry insights.</p>
          </div>
          
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-surface-container-high border border-white/5 rounded-lg px-4 py-3 text-xs font-medium focus:outline-none focus:border-primary/40 flex-grow transition-all shadow-inner"
            />
            <button className="bg-primary text-on-primary px-4 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">east</span>
            </button>
          </form>
        </div>
      </div>
      
      {/* Bottom Bar — Disciplined Branding */}
      <div className="safe-area pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/70">
            © {currentYear} Chitlin’ Network TV. A Global Cultural Institution.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-1 h-1 bg-primary rounded-full" />
            <p className="text-[9px] font-bold text-outline uppercase tracking-[0.2em] opacity-50">
              Owned and Operated by Independent Black Media Leaders.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-outline-variant/60">
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="#" className="hover:text-primary transition-colors">Press</Link>
        </div>
      </div>
    </footer>
  );
}
