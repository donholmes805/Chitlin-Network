'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import MediaCard from "@/components/media/MediaCard";
import ChannelCard from "@/components/media/ChannelCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-background overflow-x-hidden">
      <PublicHeader />
      
      <main className="flex-grow">
        {/* Cinematic Hero Section — Investor-Grade Editorial Layout */}
        <section className="relative min-h-[90vh] flex items-center pt-48 pb-32 overflow-hidden bg-background">
          {/* Global Background Layer — Deep and Soulful */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/85 z-10" />
            <img 
              className="w-full h-full object-cover scale-105 animate-float opacity-30 blur-[2px]" 
              src="https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=2000" 
              alt="Soulful Stage Mood"
            />
            {/* Master Overlays for Focus */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20 z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-background to-transparent z-30" />
          </div>
          
          <div className="relative z-40 safe-area flex flex-col items-start h-full">
            {/* Left-Aligned Bold Editorial Content — Disciplined Scale */}
            <div className="space-y-12 max-w-4xl">
              <div className="flex items-center gap-5 animate-fade-in">
                <span className="h-0.5 w-20 bg-primary rounded-full shadow-[0_0_15px_rgba(242,202,80,0.6)]"></span>
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Independent Excellence</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl xl:text-9xl font-headlines font-black text-white leading-[0.85] tracking-tighter italic drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                Independent Culture. <br/>
                <span className="text-gold">Live Television.</span> <br/>
                Real Ownership.
              </h1>
              
              <div className="space-y-10">
                <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed font-medium editorial-text opacity-90">
                  Chitlin’ Network is the global home for independent Black media. A premium cable-style destination for authentic news, live sports, and original storytelling.
                </p>
                
                <div className="flex flex-wrap gap-6 pt-2">
                  <Link href="/watch-live" className="btn-gold group flex items-center gap-4 !px-12 !py-6 !text-sm !rounded-xl">
                    <span className="material-symbols-outlined text-3xl leading-none group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                    Watch Live Now
                  </Link>
                  <Link href="/start-a-channel" className="btn-outline !px-12 !py-6 !text-sm !rounded-xl">
                    Partner With Us
                  </Link>
                </div>
              </div>

              {/* Integrated Hero Stats — Clean & Professional */}
              <div className="flex flex-wrap items-center gap-12 md:gap-20 pt-16 border-t border-white/5">
                <div className="space-y-2">
                  <p className="text-4xl md:text-6xl font-headlines font-black text-white italic tracking-tighter">8.4M+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-80">Global Viewership</p>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/5" />
                <div className="space-y-2">
                  <p className="text-4xl md:text-6xl font-headlines font-black text-white italic tracking-tighter">150+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-80">Active Channels</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Channels — Professional Spotlight Grid */}
        <section className="py-48 safe-area relative bg-background z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px] -mr-80 -mt-80 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_10px_rgba(242,202,80,0.4)]" />
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Featured Network Directory</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-headlines font-black text-white italic tracking-tighter leading-none">Global Channels</h2>
            </div>
            <Link href="/channels" className="group text-primary font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 hover:gap-5 transition-all">
              Browse All Networks
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <ChannelCard 
              href="/channels"
              name="Chitlin' Newsroom" 
              description="Unfiltered global perspectives and community-led journalism from modern Black-owned newsrooms." 
              imageUrl="https://images.unsplash.com/photo-1551817958-c5b5d1b74a23?auto=format&fit=crop&q=80&w=1000"
              category="JOURNALISM"
            />
            <ChannelCard 
              href="/channels"
              name="Stage \u0026 Soul" 
              description="Legendary live performances, jazz lounges, and soul sessions captured in world-class independent studios." 
              imageUrl="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=1000"
              category="MUSIC"
            />
            <ChannelCard 
              href="/channels"
              name="Indie Cinema House" 
              description="Award-winning shorts and features from the next generation of independent Black filmmakers." 
              imageUrl="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000"
              category="FILM"
            />
          </div>
        </section>

        {/* Live Now — Professional Broadcast Presentation */}
        <section className="py-48 safe-area bg-surface-container-low border-y border-white/5 relative overflow-hidden z-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,202,80,0.03)_0%,transparent_70%)]"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-24 relative z-10">
            <div className="flex items-center gap-10">
              <h2 className="text-4xl md:text-7xl font-headlines font-black text-white italic tracking-tighter leading-none">Live Now</h2>
              <div className="flex items-center gap-4 bg-secondary/5 border border-secondary/20 px-6 py-2 rounded-full">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                <span className="text-secondary font-black uppercase tracking-[0.3em] text-[9px]">Live Broadcast</span>
              </div>
            </div>
            <Link href="/guide" className="btn-outline !py-4 !px-10 !text-[10px] !rounded-lg">
              Full Program Guide
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <MediaCard 
              title="The Front Porch Report"
              subtitle="Community Perspectives • 12.4k Watching"
              imageUrl="https://images.unsplash.com/photo-1540226716919-66929b370da0?auto=format&fit=crop&q=80&w=1000"
              isLive={true}
              progress={65}
              className="w-full"
            />
            <MediaCard 
              title="Late Night Jazz Loft"
              subtitle="Live Studio Jam • 8.9k Watching"
              imageUrl="https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=1000"
              isLive={true}
              progress={30}
              className="w-full"
            />
          </div>
        </section>

        {/* Creator Ownership — Professional CTA Section */}
        <section className="py-64 safe-area text-center relative overflow-hidden z-30">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-background/95 z-10" />
             <img src="https://images.unsplash.com/photo-1533750516457-a7f992034fce?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-10" alt="Creator Stage" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,202,80,0.1)_0%,transparent_70%)]" />
          </div>

          <div className="relative z-20 max-w-5xl mx-auto space-y-16">
            <div className="inline-flex items-center gap-4 bg-primary/10 border border-primary/20 px-10 py-4 rounded-full mb-8">
              <span className="material-symbols-outlined text-primary text-2xl">stars</span>
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Creator Empowerment Initiative</span>
            </div>
            
            <h2 className="text-5xl md:text-8xl font-headlines font-black text-white italic tracking-tighter leading-none">
              Own Your Platform. <br/>
              <span className="text-gold">Build Your Legacy.</span>
            </h2>
            
            <p className="text-lg md:text-2xl text-on-surface-variant leading-relaxed editorial-text max-w-4xl mx-auto font-medium opacity-80">
              Chitlin’ Network empowers filmmakers and storytellers to launch independent channels with full control over content, data, and revenue.
            </p>
            
            <div className="pt-12">
              <Link href="/start-a-channel" className="btn-gold !px-20 !py-8 !text-xl !rounded-2xl hover:shadow-[0_0_80px_rgba(242,202,80,0.4)]">
                Launch Your Channel
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
