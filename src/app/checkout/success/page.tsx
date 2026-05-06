'use client';

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <PublicHeader />
      <main className="flex-grow pt-28 pb-20 safe-area flex items-center justify-center">
        <div className="glass-panel rounded-3xl border-white/5 p-12 max-w-2xl text-center">
          <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headlines font-black italic mb-4">Checkout Successful</h1>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-10">
            Your Chitlin&apos; Network checkout was successful. Your account will update once payment is confirmed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/owner" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
              Go to Dashboard
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

