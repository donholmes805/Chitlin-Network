'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Show, Episode } from "@/types";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function ShowClient() {
  const { showId } = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShow() {
      if (!showId) return;
      try {
        const showDoc = await getDoc(doc(db, 'shows', showId as string));
        if (showDoc.exists()) {
          setShow({ id: showDoc.id, ...showDoc.data() } as Show);
          
          // Load episodes
          const eq = query(
            collection(db, 'episodes'), 
            where('showId', '==', showId),
            where('status', '==', 'approved'),
            orderBy('episodeNumber', 'asc')
          );
          const eSnap = await getDocs(eq);
          setEpisodes(eSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Episode[]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadShow();
  }, [showId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicHeader />
        <main className="flex-grow flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-4xl font-headlines font-black mb-4">Show Not Found</h1>
            <p className="text-on-surface-variant mb-8">The content you're looking for may have been moved or archived.</p>
            <Link href="/shows" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
              Back to Catalog
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      {/* Hero Backdrop */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={show.bannerUrl || show.posterUrl} className="w-full h-full object-cover opacity-30 grayscale-[50%]" alt={show.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end safe-area pb-20">
          <div className="flex flex-col md:flex-row gap-12 items-end">
            <div className="hidden md:block w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
              <img src={show.posterUrl} className="w-full h-full object-cover" alt={show.title} />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-primary text-on-primary px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase">{show.category}</span>
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">{show.rating}</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-headlines font-black mb-6 italic tracking-tighter leading-none">{show.title}</h1>
              <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">{show.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <main className="safe-area py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-headlines font-black italic">Episodes</h2>
          <span className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">{episodes.length} Total</span>
        </div>

        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {episodes.map((episode) => (
              <Link key={episode.id} href={`/watch/${episode.id}`} className="group">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                  <img src={episode.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={episode.title} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white">
                    {Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">E{episode.episodeNumber}: {episode.title}</h3>
                <p className="text-on-surface-variant text-sm line-clamp-2">{episode.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-20 rounded-3xl text-center border-white/5">
            <h3 className="text-xl font-headlines font-bold mb-2 opacity-50">No Episodes Uploaded Yet</h3>
            <p className="text-on-surface-variant">Stay tuned for the premiere of this series.</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
