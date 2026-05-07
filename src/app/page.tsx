'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-[#f5efe3] selection:bg-[#f2ca50] selection:text-[#080808] overflow-x-hidden font-body">
      <PublicHeader />
      
      <main className="flex-grow">
        {/* SECTION 1 — HERO / LAUNCH ANNOUNCEMENT */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Hero Background with Faded Edges */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent z-10" />
            <img 
              src="/launch_hero_soulful_1778116090612.png" 
              alt="Soulful Atmosphere"
              className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
            />
          </div>

          <div className="relative z-20 safe-area">
            <div className="max-w-4xl space-y-8 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <span className="h-0.5 w-12 bg-[#f2ca50]"></span>
                <span className="text-[#f2ca50] font-black uppercase tracking-[0.4em] text-[10px]">Announcing the Launch</span>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-headlines font-black leading-[0.9] tracking-tighter italic">
                A New Home for <br/>
                <span className="text-gold">Black American Media.</span>
              </h1>
              
              <div className="space-y-6">
                <p className="text-2xl md:text-4xl font-headlines font-black italic text-white/90">
                  Launching December 6, 2026
                </p>
                <p className="text-xl md:text-2xl text-[#c8b892] max-w-2xl leading-relaxed editorial-text">
                  Chitlin’ Network TV is a premium television and streaming network built to elevate Black American culture through live channels, original programming, music, news, sports, documentaries, faith, and community voices.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-8">
                <a href="#launch-list" className="btn-gold !px-12 !py-6 !text-sm">
                  Join the Launch List
                </a>
                <Link href="/apply" className="btn-outline !px-12 !py-6 !text-sm">
                  Apply for a Channel
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <span className="material-symbols-outlined text-4xl text-[#f2ca50]">keyboard_double_arrow_down</span>
          </div>
        </section>

        {/* SECTION 2 — WHY DECEMBER 6, 2026 */}
        <section className="py-32 relative bg-[#0c0c0c] border-y border-white/5">
          <div className="safe-area grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl leading-tight">
                Honoring <br/>
                <span className="text-gold">Legacy.</span>
              </h2>
              <div className="space-y-6 text-[#c8b892] text-lg leading-relaxed editorial-text">
                <p>
                  Chitlin’ Network TV will launch on <span className="text-white font-bold">December 6, 2026</span>, honoring the date that marks the ratification of the Thirteenth Amendment on December 6, 1865.
                </p>
                <p>
                  This launch represents not only a media debut, but a statement of legacy, voice, ownership, and cultural continuity. We are building a platform that honors where we’ve been while broadcasting where we are going.
                </p>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-video overflow-hidden feather-mask-all">
               <img 
                src="/timeline_1800s_reconstruction_1778116109608.png" 
                alt="1865 Symbolism"
                className="w-full h-full object-cover opacity-80 brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-4xl font-headlines font-black italic text-white tracking-tighter">1865 — 2026</p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f2ca50]">The Unbroken Line</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — WHAT IS CHITLIN’ NETWORK TV? */}
        <section className="py-48 safe-area relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-32 space-y-6">
            <div className="inline-flex items-center gap-4 bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-8 py-3 rounded-full mb-6">
              <span className="text-[#f2ca50] font-black uppercase tracking-[0.4em] text-[10px]">The Infrastructure of Culture</span>
            </div>
            <h2 className="text-5xl md:text-8xl">A Network Built for Us.</h2>
            <p className="text-xl md:text-2xl text-[#c8b892] leading-relaxed editorial-text">
              We are creating a high-definition broadcast environment where independent creators own their signal and communities see themselves reflected with excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Live Programming",
                desc: "Real-time scheduled television channels across news, sports, and entertainment.",
                icon: "broadcast_on_home"
              },
              {
                title: "Music & Culture",
                desc: "Dedicated spaces for Blues, Jazz, Soul, Gospel, and Hip-Hop traditions.",
                icon: "library_music"
              },
              {
                title: "Community Voice",
                desc: "A platform for faith leaders, historians, educators, and local commentators.",
                icon: "campaign"
              },
              {
                title: "Independent Cinema",
                desc: "A premier destination for Black American filmmakers to showcase original work.",
                icon: "movie"
              },
              {
                title: "Information & News",
                desc: "Journalism grounded in the truth of our communities and global experiences.",
                icon: "newspaper"
              },
              {
                title: "Sports & Heritage",
                desc: "Celebrating the athletic legacy and cultural impact of Black American sports.",
                icon: "sports_score"
              }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-3xl bg-[#101010] border border-white/5 hover:border-[#f2ca50]/30 transition-all duration-500 group">
                <span className="material-symbols-outlined text-4xl text-[#f2ca50] mb-8 group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="text-2xl mb-4 group-hover:text-[#f2ca50] transition-colors">{item.title}</h3>
                <p className="text-[#c8b892] leading-relaxed text-sm opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — WHO IT SERVES */}
        <section className="py-48 bg-[#050505] relative overflow-hidden z-10 border-t border-white/5">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#f2ca50]/5 rounded-full blur-[200px] -mr-96 -mt-48 pointer-events-none z-0" />
          
          <div className="safe-area grid lg:grid-cols-2 gap-32 items-center relative z-10">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-2xl aspect-[4/5] md:aspect-square overflow-hidden feather-mask-all bg-gradient-to-br from-[#181818] via-[#f2ca50]/5 to-[#080808] rounded-3xl">
                <img 
                  src="/chitlin_network_audience_community_soul_1778126520205.png" 
                  alt="Chitlin' Network Community"
                  className="w-full h-full object-cover opacity-100 scale-105 brightness-[1.1] contrast-[1.05] relative z-10"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Fallback Icon / Text if image fails */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0">
                  <span className="material-symbols-outlined text-6xl text-[#f2ca50]/20 mb-4">groups</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f2ca50]/30">Our Community</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl italic">Our Audience. <br/><span className="text-gold">Our Community.</span></h2>
                <p className="text-xl text-[#c8b892] leading-relaxed editorial-text">
                  Chitlin’ Network TV exists to serve viewers who want meaningful media grounded in Black American life, culture, excellence, and storytelling.
                </p>
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Independent Creators",
                  "Cultural Storytellers",
                  "Faith Communities",
                  "Historians & Educators",
                  "Journalists & Commentators",
                  "Families & Communities"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 6 — CULTURAL TIMELINE / VISUAL STORY ARC */}
        <section className="py-64 bg-[#080808] overflow-hidden relative z-10 border-t border-white/5">
          <div className="safe-area mb-24 relative">
            <h2 className="text-6xl md:text-9xl italic tracking-tighter opacity-10 absolute top-0 left-0 select-none z-0">THE SIGNAL CONTINUES</h2>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl mb-8">From Legacy to <span className="text-gold">Launch.</span></h2>
              <p className="max-w-2xl text-xl text-[#c8b892] editorial-text">A visual journey of Black American culture, media, and enterprise—moving from the spirit of the 1800s to the digital signal of 2026.</p>
            </div>
          </div>

          <div className="relative flex flex-col space-y-32">
            {/* Timeline Item 1 */}
            <div className="relative min-h-[60vh] flex items-center">
              <div className="absolute right-0 w-3/4 h-full z-0 opacity-60 feather-mask-left">
                <img src="/timeline_1800s_reconstruction_1778116109608.png" className="w-full h-full object-cover brightness-110" />
              </div>
              <div className="safe-area relative z-10">
                <div className="max-w-xl space-y-4">
                  <p className="text-[#f2ca50] font-black uppercase tracking-[0.5em] text-xs">1800s — Reconstruction</p>
                  <h3 className="text-4xl md:text-6xl italic">The Foundation.</h3>
                  <p className="text-[#c8b892] leading-relaxed">Early Black American resilience, the birth of independent enterprise, and the formalization of our cultural voice in a new era of freedom.</p>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative min-h-[60vh] flex items-center">
              <div className="absolute left-0 w-3/4 h-full z-0 opacity-60 feather-mask-right">
                <img src="/timeline_black_enterprise_greenwood_1778116123218.png" className="w-full h-full object-cover brightness-110" />
              </div>
              <div className="safe-area relative z-10 flex justify-end">
                <div className="max-w-xl space-y-4 text-right">
                  <p className="text-[#f2ca50] font-black uppercase tracking-[0.5em] text-xs">1900s — Enterprise & Movement</p>
                  <h3 className="text-4xl md:text-6xl italic">Greenwood Legacy.</h3>
                  <p className="text-[#c8b892] leading-relaxed">The rise of Black Wall Street, the Great Migration, and the establishment of the Black Press as a vital beacon for our stories.</p>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative min-h-[60vh] flex items-center">
              <div className="absolute right-0 w-3/4 h-full z-0 opacity-60 feather-mask-left">
                <img src="/timeline_jazz_blues_soul_1778116135288.png" className="w-full h-full object-cover brightness-110" />
              </div>
              <div className="safe-area relative z-10">
                <div className="max-w-xl space-y-4">
                  <p className="text-[#f2ca50] font-black uppercase tracking-[0.5em] text-xs">Mid-Century — Sound & Soul</p>
                  <h3 className="text-4xl md:text-6xl italic">The Cultural Signal.</h3>
                  <p className="text-[#c8b892] leading-relaxed">Blues, Jazz, and Soul become the global language. The emergence of Black Radio and Television as tools of liberation and joy.</p>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative min-h-[60vh] flex items-center">
              <div className="absolute left-0 w-3/4 h-full z-0 opacity-60 feather-mask-right">
                <img src="/timeline_future_media_creator_1778116156616.png" className="w-full h-full object-cover brightness-110" />
              </div>
              <div className="safe-area relative z-10 flex justify-end">
                <div className="max-w-xl space-y-4 text-right">
                  <p className="text-[#f2ca50] font-black uppercase tracking-[0.5em] text-xs">2026 — The Future</p>
                  <h3 className="text-4xl md:text-6xl italic">Chitlin’ Network.</h3>
                  <p className="text-[#c8b892] leading-relaxed">The signal returns to our hands. A premium, independent network built for the next century of Black American media ownership.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — CHANNEL / CREATOR APPLICATIONS */}
        <section className="py-48 bg-[#101010] relative overflow-hidden z-10 border-t border-white/5">
          <div className="safe-area grid md:grid-cols-2 gap-20 items-center">
             <div className="space-y-10">
              <h2 className="text-5xl md:text-7xl italic">Join the <br/><span className="text-gold">Network.</span></h2>
              <div className="space-y-6 text-[#c8b892] leading-relaxed editorial-text">
                <p>
                  We are looking for mission-aligned media creators, producers, and channel owners to join our founding launch lineup.
                </p>
                <p>
                  Applications are reviewed manually for quality, professionalism, and cultural alignment. We prioritize content that reflects, supports, documents, celebrates, or meaningfully engages Black American culture.
                </p>
                <div className="pt-8">
                  <Link href="/apply" className="btn-gold !px-12 !py-6 !text-sm">
                    Apply to Launch a Channel
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-[#080808] p-12 rounded-3xl border border-white/10 shadow-3xl space-y-8">
              <h3 className="text-2xl text-white italic">Application Focus Areas</h3>
              <ul className="space-y-6">
                {[
                  { label: "Alignment", desc: "Consistency with the network mission." },
                  { label: "Quality", desc: "High production value and professional standards." },
                  { label: "Ownership", desc: "Commitment to independent media traditions." },
                  { label: "Relevance", desc: "Meaningful engagement with the community." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <span className="text-[#f2ca50] font-black text-lg">0{i+1}</span>
                    <div>
                      <p className="text-white font-bold uppercase tracking-widest text-[10px] mb-1">{item.label}</p>
                      <p className="text-[#c8b892] text-sm opacity-70">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 7 — WHAT MAKES THE NETWORK DIFFERENT */}
        <section className="py-48 safe-area text-center relative z-10 border-t border-white/5">
          <h2 className="text-5xl md:text-8xl mb-24">The Difference.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Culturally Focused", desc: "Built from the ground up to center Black American media." },
              { title: "Creator Forward", desc: "Prioritizing the rights and revenue of the artists." },
              { title: "Independent", desc: "Free from the constraints of legacy media conglomerate interests." },
              { title: "Premium Built", desc: "Designed for investor-grade performance and scale." }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-gold text-xl">{item.title}</h3>
                <p className="text-[#c8b892] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8 — FOUNDING LAUNCH INVITATION */}
        <section id="launch-list" className="py-48 bg-gradient-to-b from-[#080808] to-[#101010] relative z-10 overflow-hidden border-t border-white/5">
          <div className="safe-area max-w-4xl mx-auto">
            <div className="glass-panel p-16 rounded-[40px] text-center space-y-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#f2ca50]/5 pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <h2 className="text-5xl md:text-7xl">Founding <br/>Launch List</h2>
                <p className="text-xl text-[#c8b892] editorial-text">Be the first to know when we go live. Join the movement to reclaim the signal.</p>
              </div>

              <form className="max-w-2xl mx-auto space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-[#f2ca50] outline-none transition-colors" />
                  <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-[#f2ca50] outline-none transition-colors" />
                </div>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[#c8b892] focus:border-[#f2ca50] outline-none transition-colors appearance-none">
                  <option>I am a Viewer</option>
                  <option>I am a Creator</option>
                  <option>I am a Potential Partner</option>
                  <option>I am an Advertiser</option>
                </select>
                <textarea placeholder="Tell us more (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-[#f2ca50] outline-none transition-colors h-32"></textarea>
                <button type="submit" className="btn-gold w-full !py-6 !text-sm">Submit to Launch List</button>
              </form>
            </div>
          </div>
        </section>

        {/* SECTION 9 — FINAL CALL TO ACTION */}
        <section className="py-64 text-center relative overflow-hidden z-10 border-t border-white/5">
          <div className="absolute inset-0 z-0">
            <img src="/launch_hero_soulful_1778116090612.png" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]" />
          </div>
          
          <div className="relative z-10 safe-area space-y-16">
            <div className="space-y-4">
              <p className="text-[#f2ca50] font-black uppercase tracking-[0.5em] text-xs">December 6, 2026</p>
              <h2 className="text-6xl md:text-9xl leading-none">Built on Legacy. <br/><span className="text-gold">Launching the Future.</span></h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <a href="#launch-list" className="btn-gold !px-16 !py-8 !text-lg !rounded-2xl">Join the Movement</a>
              <Link href="/apply" className="btn-outline !px-16 !py-8 !text-lg !rounded-2xl">Apply for a Channel</Link>
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
