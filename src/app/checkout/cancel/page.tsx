'use client';

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <PublicHeader />
      <main className="flex-grow pt-28 pb-20 safe-area flex items-center justify-center">
        <div className="glass-panel rounded-3xl border-white/5 p-12 max-w-2xl text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">undo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headlines font-black italic mb-4">Checkout Canceled</h1>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-10">
            Checkout was canceled. You can return anytime to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/start-a-channel" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
              Return to Plans
            </Link>
            <Link href="/" className="bg-surface-container-high px-10 py-4 rounded-xl border border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
              Back Home
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

