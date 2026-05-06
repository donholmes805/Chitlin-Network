'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ChannelCard from "@/components/media/ChannelCard";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Channel } from "@/types";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchChannels() {
      try {
        const q = query(collection(db, 'channels'), where('status', '==', 'approved'));
        const snap = await getDocs(q);
        setChannels(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Channel)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchChannels();
  }, []);

  const categories = ["All", ...Array.from(new Set(channels.map(c => c.category))).sort()];
  const filtered = channels.filter(c => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h1 className="text-6xl md:text-8xl font-headlines font-black text-white mb-6 tracking-tighter">Network Directory</h1>
            <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
              Explore independent broadcasting networks. From culture and music to news and sports, the Chitlin’ Network ecosystem is diverse and growing.
            </p>
          </header>

          {!loading && channels.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="flex-1">
                <div className="glass-panel rounded-2xl border-white/5 px-6 py-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">search</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search channels..."
                    className="bg-transparent outline-none w-full text-on-surface placeholder:text-on-surface-variant/70 font-semibold"
                  />
                </div>
              </div>
              <div className="md:w-80">
                <div className="glass-panel rounded-2xl border-white/5 px-6 py-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">tune</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-transparent outline-none w-full text-on-surface font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-surface text-on-surface">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[200px] rounded-xl bg-surface-container-high animate-pulse" />
              ))}
            </div>
          ) : channels.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border-white/5">
              <span className="material-symbols-outlined text-6xl text-white/10 mb-4">leak_remove</span>
              <h2 className="text-2xl font-headlines font-bold mb-2">No Networks Live</h2>
              <p className="text-on-surface-variant">The directory is being updated. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(channel => (
                <ChannelCard 
                  key={channel.id}
                  id={channel.id}
                  name={channel.name}
                  category={channel.category}
                  description={channel.description || `Explore ${channel.name} on the Chitlin’ Network.`}
                  imageUrl={channel.logoUrl}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
