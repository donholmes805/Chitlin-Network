'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Show } from "@/types";
import Link from "next/link";

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      try {
        const q = query(collection(db, 'shows'), where('status', '==', 'approved'));
        const snap = await getDocs(q);
        setShows(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Show)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h1 className="text-6xl md:text-8xl font-headlines font-black text-white mb-6 tracking-tighter">On-Demand Series</h1>
            <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
              Binge your favorite independent programming. From gritty documentaries to community news and soul-stirring music performances.
            </p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-[2/3] rounded-2xl bg-surface-container-high animate-pulse" />
              ))}
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border-white/5">
              <span className="material-symbols-outlined text-6xl text-white/10 mb-4">movie_filter</span>
              <h2 className="text-2xl font-headlines font-bold mb-2">No Series Available</h2>
              <p className="text-on-surface-variant">Check back soon for premiere episodes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {shows.map(show => (
                <Link key={show.id} href={`/shows/${show.id}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 feather-mask-all">
                    <img 
                      src={show.posterUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-80" 
                      alt={show.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary/90 backdrop-blur-md text-on-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {show.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-headlines font-bold text-white mb-1 group-hover:text-primary transition-colors">{show.title}</h3>
                  <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">
                    {show.rating} • {show.status}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
