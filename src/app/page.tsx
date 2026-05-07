'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { CHANNEL_PLANS, AD_PACKAGES } from "@/lib/pricing";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface selection:bg-primary selection:text-background overflow-x-hidden font-body">
      <PublicHeader />
      
      <main className="flex-grow">
        {/* SECTION 1 — CINEMATIC HERO */}
        <section className="relative min-h-[95vh] flex items-center pt-32 pb-20 overflow-hidden cinematic-vignette">
          {/* Background Image with Feathering */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 opacity-80" />
            <img 
              src="/launch_hero_soulful_1778116090612.png" 
              alt="Chitlin' Network Cinematic Hero"
              className="w-full h-full object-cover opacity-60 feather-mask-bottom scale-105 animate-slow-zoom"
            />
          </div>

          <div className="relative z-20 safe-area">
            <div className="max-w-4xl space-y-10 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <span className="h-px w-16 bg-primary"></span>
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[11px]">Launching December 6, 2026</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-headlines font-black leading-[0.9] md:leading-[0.85] tracking-tighter italic">
                The Home for <br/>
                <span className="text-gold">Black Culture.</span>
              </h1>
              
              <div className="space-y-8">
                <p className="text-xl md:text-3xl text-on-surface-variant max-w-2xl leading-relaxed editorial-text font-medium">
                  A premium streaming institution built for independent voices, soulful storytelling, and cultural ownership.
                </p>
                
                <div className="flex flex-wrap gap-6 pt-4">
                  <a href="#launch-list" className="btn-gold !px-14 !py-7 !text-[11px]">
                    Join the Launch List
                  </a>
                  <Link href="/start-a-channel" className="btn-outline !px-14 !py-7 !text-[11px]">
                    Apply for a Channel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — CONTENT RAILS (WHAT IS CHITLIN?) */}
        <section className="py-32 relative z-10">
          <div className="safe-area mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl italic">The Network <span className="text-gold">Ecosystem.</span></h2>
            <p className="text-on-surface-variant text-lg max-w-2xl">A curated universe of programming, news, and independent cinema built on the legacy of excellence.</p>
          </div>

          <div className="relative w-full group/rail">
            {/* Navigation Arrows - Visible on Desktop Hover */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-primary/80 text-white w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:border-primary opacity-0 group-hover/rail:opacity-100 transition-all duration-300 hidden md:flex backdrop-blur-sm shadow-2xl"
              aria-label="Scroll Left"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-primary/80 text-white w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:border-primary opacity-0 group-hover/rail:opacity-100 transition-all duration-300 hidden md:flex backdrop-blur-sm shadow-2xl"
              aria-label="Scroll Right"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            <div 
              ref={railRef}
              className="horizontal-rail px-5 md:px-20 scrollbar-hide snap-x snap-proximity"
            >
              {[
                { title: "Live Channels", desc: "24/7 linear broadcast experience.", img: "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&q=80&w=800", icon: "broadcast_on_home" },
                { title: "Original Shows", desc: "Soulful series you won't find anywhere else.", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800", icon: "movie" },
                { title: "News & Culture", desc: "Reporting that speaks our truth.", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800", icon: "newspaper" },
                { title: "Music & Jazz", desc: "Celebrating the root of the sound.", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800", icon: "library_music" },
                { title: "Faith & Gospel", desc: "Messages of hope and resilience.", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800", icon: "church" },
                { title: "Sports & Heritage", desc: "The impact of the Black athlete.", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800", icon: "sports_score" },
              ].map((item, i) => (
                <div key={i} className="focus-card group snap-center" tabIndex={0}>
                  {/* Fallback Branded Layer */}
                  <div className="card-fallback">
                    <span className="material-symbols-outlined card-fallback-icon">{item.icon}</span>
                  </div>
                  
                  {/* Media Layer */}
                  <img 
                    src={item.img} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 z-10" 
                    alt={item.title}
                    loading="lazy"
                  />
                  
                  {/* Overlay & Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-30">
                    <span className="material-symbols-outlined text-primary mb-4">{item.icon}</span>
                    <h3 className="text-2xl mb-1 text-white">{item.title}</h3>
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
              {/* Spacer to maintain end padding */}
              <div className="flex-shrink-0 w-5 md:w-20 h-1" />
            </div>
          </div>
        </section>

        {/* SECTION 3 — INVESTOR VALUE PROPOSITION */}
        <section className="py-48 bg-surface-container-low border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -mr-96 -mt-48 pointer-events-none" />
          
          <div className="safe-area grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-primary font-black uppercase tracking-[0.5em] text-[11px]">The Business Model</p>
                <h2 className="text-5xl md:text-8xl italic">Scaling <span className="text-gold">Ownership.</span></h2>
                <p className="text-xl text-on-surface-variant leading-relaxed editorial-text max-w-xl">
                  Chitlin’ Network TV is more than a streaming service—it’s a media infrastructure company designed for recurring revenue and cultural scale.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: "Recurring Memberships", val: "Tiered Viewer Plans" },
                  { label: "Channel Subscriptions", val: "SaaS Model for Creators" },
                  { label: "Direct Ad Revenue", val: "Manual High-Value Inventory" },
                  { label: "Global Distribution", val: "Android TV, Roku, Apple TV" }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">{item.label}</p>
                    <p className="text-xl text-white italic">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square rounded-[3rem] overflow-hidden feather-mask-all border border-white/10 bg-surface-container-high">
              <img 
                src="/chitlin_network_editorial_legacy_soul_1778126179608.png" 
                alt="Chitlin Network Legacy"
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-panel p-10 rounded-3xl text-center space-y-4 max-w-xs scale-110">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Market Opportunity</p>
                  <p className="text-4xl font-headlines font-black text-white italic">$40B+</p>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Digital Media Reach</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — CREATOR OPPORTUNITY / PRICING */}
        <section className="py-48 bg-background relative z-10">
          <div className="safe-area text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-8xl italic">Join the <span className="text-gold">Lineup.</span></h2>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto editorial-text">
              We are inviting mission-aligned creators to launch their own linear channels. 
              Manual review ensures quality, alignment, and professional excellence.
            </p>
          </div>

          <div className="safe-area grid grid-cols-1 md:grid-cols-3 gap-10">
            {CHANNEL_PLANS.map((plan) => (
              <div key={plan.id} className="media-card p-8 md:p-12 flex flex-col h-full space-y-10 group">
                <div className="space-y-4">
                  <p className="text-primary font-black uppercase tracking-widest text-[11px]">{plan.label || plan.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-headlines font-black text-white italic">${plan.monthlyFee}</span>
                    <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">/ month</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
                    + {plan.adminFee} non-refundable admin fee
                  </p>
                </div>

                <div className="h-px bg-white/5" />

                <ul className="flex-grow space-y-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-4 items-start text-sm text-on-surface-variant group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                  {/* Additional Dynamic Info handled by plan features */}

                </ul>

                <Link href="/start-a-channel" className={`w-full text-center py-5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${plan.id === 'growth' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'bg-white/5 border border-white/10 hover:border-primary/40'}`}>
                  Select {plan.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Clarity & Introductory Pricing Notes */}
          <div className="safe-area mt-12 space-y-6 text-center">
            <div className="inline-block glass-panel px-8 py-4 rounded-2xl border-white/5">
              <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed max-w-3xl mx-auto">
                <span className="text-primary font-black uppercase tracking-widest mr-2">Note:</span>
                Channel owners are responsible for maintaining their own approved media hosting for pre-recorded content. 
                Chitlin’ Network TV provides the channel platform, scheduling, distribution, monetization tools, and approved live broadcast infrastructure where included.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-loose opacity-80">
                Introductory Founder Pricing is available for early channel partners before the official launch. 
                Pricing may increase as Chitlin’ Network TV expands audience reach, distribution, live broadcasting capacity, advertising demand, and platform features.
              </p>
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[9px]">
                Founding channel partners may keep their introductory rate as long as their account remains active and in good standing.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5 — ADVERTISING OPPORTUNITY */}
        <section className="py-48 bg-surface-container-low relative overflow-hidden">
          <div className="safe-area grid lg:grid-cols-2 gap-32 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {AD_PACKAGES.map((pkg) => (
                   <div key={pkg.id} className="bg-surface-container-high p-8 rounded-2xl border border-white/5 space-y-4 hover:border-primary/30 transition-all group">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">{pkg.name}</p>
                     <p className="text-3xl font-headlines font-black text-white italic">{pkg.price}</p>
                     <p className="text-[9px] text-on-surface-variant font-medium leading-relaxed">{pkg.description}</p>
                   </div>
                 ))}
                 <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 flex flex-col justify-center items-center text-center space-y-3">
                    <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">Manual Quality Review</p>
                 </div>
               </div>
            </div>

            <div className="order-1 lg:order-2 space-y-10">
              <div className="space-y-4">
                <p className="text-primary font-black uppercase tracking-[0.5em] text-[11px]">Brand Partnerships</p>
                <h2 className="text-5xl md:text-8xl italic">Advertise with <span className="text-gold">Intent.</span></h2>
                <p className="text-xl text-on-surface-variant leading-relaxed editorial-text">
                  Reach a culturally engaged audience through high-impact video placements and sponsored show blocks. 
                  Every ad is manually reviewed to ensure it respects our viewers and mission.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/advertise" className="btn-gold !px-12 !py-6">
                  View Ad Deck
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — AUDIENCE & COMMUNITY */}
        <section className="py-64 bg-background relative overflow-hidden z-10">
          <div className="safe-area grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
               <h2 className="text-5xl md:text-9xl italic tracking-tighter">Our <span className="text-gold">People.</span></h2>
               <p className="text-2xl text-on-surface-variant editorial-text leading-relaxed">
                 Chitlin’ Network TV is built to serve the families, creators, and thinkers who represent the breadth of Black American excellence.
               </p>
               <ul className="grid grid-cols-2 gap-x-12 gap-y-8">
                 {[
                   "Independent Creators",
                   "Cultural Storytellers",
                   "Faith Communities",
                   "Historians & Educators",
                   "Journalists & Commentators",
                   "Families & Viewers"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/80">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                     {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden feather-mask-all">
               <img 
                 src="/chitlin_network_audience_community_soul_1778126520205.png" 
                 alt="Community Atmosphere"
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* SECTION 7 — LEGACY TIMELINE */}
        <section className="py-64 bg-surface-container-low relative z-10">
          <div className="safe-area mb-32 text-center">
            <p className="text-primary font-black uppercase tracking-[0.5em] text-[11px] mb-6">Historical Arc</p>
            <h2 className="text-4xl md:text-[8rem] lg:text-[10rem] italic leading-none tracking-tighter">The <span className="text-gold">Signal</span> History.</h2>
          </div>

          <div className="space-y-48">
            {[
              { year: "1865", title: "The Foundation", desc: "Honoring the ratification of the 13th Amendment. The beginning of formalized freedom and independent enterprise.", img: "/timeline_1800s_reconstruction_1778116109608.png", align: "left" },
              { year: "1920s", title: "The Legacy", desc: "The rise of Black Wall Street and the Greenwood legacy. Proof of economic and cultural self-sufficiency.", img: "/timeline_black_enterprise_greenwood_1778116123218.png", align: "right" },
              { year: "1960s", title: "The Sound", desc: "Blues, Jazz, and Soul become the global language. The birth of independent Black radio and broadcast voices.", img: "/timeline_jazz_blues_soul_1778116135288.png", align: "left" },
              { year: "2026", title: "The Future", desc: "Chitlin’ Network TV launches. Reclaiming the signal and building a permanent home for our media.", img: "/timeline_future_media_creator_1778116156616.png", align: "right" },
            ].map((item, i) => (
              <div key={i} className={`safe-area flex flex-col ${item.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-32 items-center`}>
                <div className="flex-1 space-y-6">
                  <p className="text-5xl md:text-[8rem] font-headlines font-black text-white/10 italic leading-none">{item.year}</p>
                  <h3 className="text-4xl md:text-6xl italic mt-[-1rem] md:mt-[-2rem]">{item.title}</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">{item.desc}</p>
                </div>
                <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden feather-mask-all border border-white/5">
                  <img src={item.img} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-1000" alt={item.title} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8 — FINAL CALL TO ACTION */}
        <section id="launch-list" className="py-64 bg-background relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="/launch_hero_soulful_1778116090612.png" className="w-full h-full object-cover opacity-10 blur-sm" />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
          </div>

          <div className="safe-area max-w-4xl mx-auto relative z-10 text-center space-y-20">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-9xl italic">Claim Your <span className="text-gold">Seat.</span></h2>
              <p className="text-xl text-on-surface-variant editorial-text">Be the first to join the movement on December 6, 2026.</p>
            </div>

            <div className="glass-panel p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] border-primary/20">
              <form className="space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary px-2">Full Name</label>
                    <input type="text" placeholder="John Coltrane" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-white focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary px-2">Email Address</label>
                    <input type="email" placeholder="john@chitlin.tv" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-white focus:border-primary outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary px-2">I am joining as a...</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-on-surface-variant focus:border-primary outline-none transition-all appearance-none">
                    <option>Viewer / Founding Supporter</option>
                    <option>Creator / Channel Applicant</option>
                    <option>Advertiser / Partner</option>
                    <option>Investor / Institutional Partner</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-gold !py-7 !text-xs !rounded-2xl shadow-[0_20px_50px_rgba(242,202,80,0.3)]">
                  Register for the Launch
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      <style jsx global>{`
        .animate-slow-zoom {
          animation: slow-zoom 60s ease-in-out infinite alternate;
        }
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
