'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ChannelCard from "@/components/media/ChannelCard";
import { useEffect, useState } from "react";
import { Channel } from "@/types";
import { firebaseService } from "@/lib/firebase/services";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await firebaseService.getApprovedChannels();
        setChannels(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-12">
        <section className="safe-area py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-headlines font-bold mb-4 text-primary italic">Channel Directory</h1>
              <p className="text-on-surface-variant max-w-2xl text-lg">
                Discover independent networks broadcasting the culture 24/7.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container rounded-full px-6 py-3 border border-white/5">
              <span className="material-symbols-outlined text-primary">search</span>
              <input 
                type="text" 
                placeholder="Find a channel..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-widest placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-surface-container rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : channels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {channels.map((channel) => (
                <ChannelCard 
                  key={channel.id}
                  name={channel.name}
                  description={channel.description}
                  imageUrl={channel.posterUrl}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-20 rounded-3xl text-center border-white/5">
              <span className="material-symbols-outlined text-6xl text-primary/20 mb-6">sensors_off</span>
              <h3 className="text-2xl font-headlines font-bold mb-2">No Channels Online</h3>
              <p className="text-on-surface-variant mb-8">We're currently preparing our premiere networks. Check back soon!</p>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
                Apply to Start a Channel
              </button>
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
