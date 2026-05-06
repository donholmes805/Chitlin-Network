import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 pt-12 pb-6">
      <div className="safe-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
        <div className="space-y-6">
          <span className="text-2xl font-headlines font-black text-primary italic">Chitlin’ Network</span>
          <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
            Elevating Black media and independent storytelling through a premium, cinematic streaming experience for a global audience.
          </p>
          <div className="flex gap-4">
            <a href="#" className="material-symbols-outlined text-outline hover:text-primary transition-colors">public</a>
            <a href="#" className="material-symbols-outlined text-outline hover:text-primary transition-colors">share</a>
            <a href="#" className="material-symbols-outlined text-outline hover:text-primary transition-colors">favorite</a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-on-surface-variant text-sm">
            <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Press</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Partnerships</h4>
          <ul className="space-y-4 text-on-surface-variant text-sm">
            <li><Link href="/advertise" className="hover:text-primary transition-colors">Advertise</Link></li>
            <li><Link href="/start-a-channel" className="hover:text-primary transition-colors">Start a Channel</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Content Guidelines</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Affiliates</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-on-surface-variant text-sm">
            <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="safe-area py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-on-surface-variant">© 2024 Chitlin’ Network. Black Excellence in Media.</p>
        <p className="text-sm text-outline">Designed with Pride.</p>
      </div>
    </footer>
  );
}
