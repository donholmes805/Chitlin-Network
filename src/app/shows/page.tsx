'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import MediaCard from "@/components/media/MediaCard";
import { useEffect, useState } from "react";
import { Show } from "@/types";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(
          collection(db, 'shows'), 
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setShows(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Show[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-12">
        <section className="safe-area py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-headlines font-bold mb-4 text-primary italic">On-Demand Shows</h1>
              <p className="text-on-surface-variant max-w-2xl text-lg">
                Binge-worthy series, documentaries, and originals. Always streaming.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-surface-container-high px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">filter_list</span>
                Filter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-video bg-surface-container rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : shows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {shows.map((show) => (
                <MediaCard 
                  key={show.id}
                  title={show.title}
                  subtitle={show.category}
                  imageUrl={show.posterUrl}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-20 rounded-3xl text-center border-white/5">
              <span className="material-symbols-outlined text-6xl text-primary/20 mb-6">movie_filter</span>
              <h3 className="text-2xl font-headlines font-bold mb-2">No Shows Available</h3>
              <p className="text-on-surface-variant mb-8">Our library is growing. Check back soon for the latest premieres!</p>
              <button className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl">
                Notify Me of New Releases
              </button>
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
