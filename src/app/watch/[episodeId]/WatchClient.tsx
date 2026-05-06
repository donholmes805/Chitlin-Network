'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import VideoPlayer from "@/components/media/VideoPlayer";
import { Episode, Show } from "@/types";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import Link from "next/link";

export default function WatchClient() {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [nextEpisodes, setNextEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEpisode() {
      if (!episodeId) return;
      try {
        const epDoc = await getDoc(doc(db, 'episodes', episodeId as string));
        if (epDoc.exists()) {
          const epData = { id: epDoc.id, ...epDoc.data() } as Episode;
          setEpisode(epData);
          
          // Load show data
          const showDoc = await getDoc(doc(db, 'shows', epData.showId));
          if (showDoc.exists()) {
            setShow({ id: showDoc.id, ...showDoc.data() } as Show);
          }

          // Load next episodes
          const nq = query(
            collection(db, 'episodes'),
            where('showId', '==', epData.showId),
            where('episodeNumber', '>', epData.episodeNumber),
            where('status', '==', 'approved'),
            limit(5)
          );
          const nSnap = await getDocs(nq);
          setNextEpisodes(nSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Episode[]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadEpisode();
  }, [episodeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-8 text-center">
        <h1 className="text-4xl font-headlines font-black mb-4 italic">Episode Unavailable</h1>
        <p className="text-on-surface-variant mb-12">This content may have been removed or is pending approval.</p>
        <Link href="/shows" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs">
          Browse Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="safe-area grid grid-cols-1 xl:grid-cols-4 gap-12">
          
          {/* Main Player Area */}
          <div className="xl:col-span-3 space-y-8">
            <VideoPlayer 
              provider={episode.videoProvider}
              videoUrl={episode.videoUrl}
              videoId={episode.videoId}
              posterUrl={episode.thumbnailUrl}
              autoPlay={true}
            />
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {show && (
                      <Link href={`/shows/${show.id}`} className="text-primary font-black uppercase tracking-widest text-xs hover:underline">
                        {show.title}
                      </Link>
                    )}
                    <span className="text-white/20">•</span>
                    <span className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">
                      Season {episode.seasonNumber} Episode {episode.episodeNumber}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-headlines font-black italic tracking-tighter">{episode.title}</h1>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button className="flex items-center gap-2 bg-surface-container-high px-6 py-3 rounded-xl border border-white/5 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-lg">add</span> Watchlist
                  </button>
                  <button className="flex items-center gap-2 bg-surface-container-high px-6 py-3 rounded-xl border border-white/5 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-lg">share</span> Share
                  </button>
                </div>
              </div>
              
              <div className="p-8 bg-surface-container-low rounded-2xl border border-white/5">
                <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{episode.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <h2 className="text-xl font-headlines font-black italic uppercase tracking-wider text-primary">Up Next</h2>
            <div className="flex flex-col gap-6">
              {nextEpisodes.length > 0 ? nextEpisodes.map((next) => (
                <Link key={next.id} href={`/watch/${next.id}`} className="group flex gap-4 items-start">
                  <div className="w-40 aspect-video rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img src={next.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={next.title} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">E{next.episodeNumber}: {next.title}</h3>
                    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-2">{Math.floor(next.duration / 60)}m</p>
                  </div>
                </Link>
              )) : (
                <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center">
                  <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">End of Season</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
