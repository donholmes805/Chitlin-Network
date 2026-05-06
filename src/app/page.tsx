'use client';

import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import MediaCard from "@/components/media/MediaCard";
import ChannelCard from "@/components/media/ChannelCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center safe-area overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-surface-container-lowest animate-pulse opacity-20"></div>
            <img 
              className="w-full h-full object-cover opacity-60 scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdk4v4uo2ScssGoVGZv8EAoMovzkIO-h_1A5gSGmU_yxf0zOjbc48SvI0pXkNSNQL3-Hrn1cvAgoFQz09XQrAoG6YU6nCw84YY7mKq2GmVfdsE9NLhHa7LWP-tNfyROx_DPy3JTmusYeMp65u34VpHsakEwd-OZpJhJEXFsw8kt6OaZ3i82qMUxFV7l-nVakAPRPurtZFOr0XPVi98m2Aeqmo0ktj8loMdWUI4gfKHf4tMnQn-Cun_eA7_3sqF7CCTVi6wSQ2UIl4" 
              alt="Chitlin Network Studio"
            />
            {/* Cinematic Masks */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40"></div>
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl pt-20">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="w-12 h-0.5 bg-primary rounded-full"></span>
              <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Premiere Network</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-headlines font-black text-white mb-8 leading-[0.95] tracking-tighter italic">
              Independent Culture. <br/>
              <span className="text-primary drop-shadow-[0_0_15px_rgba(242,202,80,0.3)]">Live TV.</span> <br/>
              Real Stories.
            </h1>
            
            <p className="text-xl md:text-2xl text-on-surface-variant mb-12 max-w-2xl leading-relaxed font-medium">
              Chitlin’ Network brings pre-recorded shows, live programming, news, sports, music, comedy, and independent channels into one cable-style streaming experience.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Link href="/watch-live" className="bg-primary text-on-primary px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:scale-105 hover:shadow-[0_0_30px_rgba(242,202,80,0.4)] transition-all active:scale-95">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Watch Live Now
              </Link>
              <Link href="/start-a-channel" className="glass-panel border-white/20 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white transition-all active:scale-95">
                Start a Channel
              </Link>
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="absolute bottom-12 right-12 hidden lg:flex gap-12 z-10">
            <div className="text-right">
              <p className="text-3xl font-headlines font-black text-white">8.4M+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Monthly Viewers</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-headlines font-black text-white">150+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Independent Channels</p>
            </div>
          </div>
        </section>

        {/* Featured Channels Section */}
        <section className="py-24 safe-area relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <span className="text-primary font-black uppercase tracking-widest text-[10px]">The Best in the Game</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-headlines font-black text-white italic">Featured Channels</h2>
            </div>
            <Link href="/channels" className="text-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2">
              Browse All Channels
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ChannelCard 
              name="Chitlin' Newsroom" 
              description="24/7 Global Perspectives from the community." 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCEf_Ig2IVGJe_Yr3GYDIADsAI2rDJszln1B6JYlM7Ht2R49tGq0iT-SBhevfjpApkQAV6g8CBx9QUF0liVatWbmW1vJKzk8usbyx1UaQ3fWjE-w82SCkczFlPX53HHP7kA81GiM_U0VysfSo02kT1oBrXfl4dS7UnCqAnaXd5POP5-hnx9R_BJNpsu6eAt3gUH0KcnnaFCvY_hbzCl5GeOcFuapV3dbY_QXuwEAeFaGU5DJAJj1o9bZaGmqEVRM_n7301o1eds1UA"
            />
            <ChannelCard 
              name="Soul Stage" 
              description="The biggest names in music and the rising stars." 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZK2eptWZ4RgIAQ0ddMeQcfvyGyc1YscQ2HCG-82OZEMuGXptfHi4W70EFLfDIvfHIy8kFu6vLykP2KeMQzTIcSaqGk166u5Y-waNIttj922YV0KB-XF3WDQwNm2-dbhhP3OZ4hYoOvp8JmzPB9Em-Np-90uirjVs2z5PPbdIXa4K3FFoM1Zvi8AdUahq6lvGRcqWtbWtBOgnota6yVLx-k0wlURK-qSv6xqlR3cH3y0uMCcIN9YgHr4v8GicepQf6PFP2Cz_pWw"
            />
            <ChannelCard 
              name="Indie Film House" 
              description="Award-winning cinema from independent creators." 
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDiX_TiOjziySHP7uVkKp0SQTmTSyE7yrWRPA696Ve9jrOdLku77rJQBNmavpw_BsrTSld_8g52OST52JiTZMFp0VgF0GS7QV64ojTvWeTnoLDUD7EDHDwgItcTddR6ESP-V1dpNXtZSidEnVlkb4K2nv-52Y3fbouBqdi3KFVs-oJGc9aDVM0xtglBglbVt9d4uv_Iq3czM65wkCYSw0R92ixSewESnr4Hzk1Wsj4wfVzktwkc-pdr4RIGlvP6-H2w3rK6GKVF4jQ"
            />
          </div>
        </section>

        {/* Live Now Section */}
        <section className="py-24 safe-area bg-surface-container-lowest/30 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-headlines font-black text-white italic">Live Now</h2>
                <div className="absolute -top-2 -right-12">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-container"></span>
                  </span>
                </div>
              </div>
            </div>
            <Link href="/guide" className="bg-white/5 border border-white/10 text-on-surface px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Full Program Guide
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <MediaCard 
              title="The Front Porch Report"
              subtitle="Season 4, Episode 12 • 420 watching"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuA7yh6ziQfYK8KyphwidbzMXHSLN1GoJy8vzEs99zNfeBTOkdkIvwlvJSuAg3ktl0a_RWAwYouZxCzRPhbhhWtDgAt_SGnGwusYIKvhSWF_s1NmwhHpNo00FBDRYOJYDTqzOSBmaXE84YMXqPPpXs8b4i0e0wb3rwxbOzi1PUCWqzwbQv0wMpl4d11b3p_qmCg5hIec2ar962EHChi55vBiP481_SlOyFrEFKxY_ZTTJ2lJ0k2kpU0pymPhUxp3l29FWh_jBraXAa4"
              isLive={true}
              progress={75}
            />
            <MediaCard 
              title="Southern Soul Sessions"
              subtitle="Live Jam Session • 1.2k watching"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBVafzrKr2ologpLOu64nf6cyVeLu0HDVJ0jzFhvCyqyqy8KvNc-b9XVFmrLnLyiqHd862w0Dq1x078JPTJx00_fstHOMeRaJXyeWsFwMN0RBF12ZVkKoRWEbaNnvaIkCTD9IyxQ4D32lfmMrTbI7QEYiWCoHhNQRBvbajtbE6XHIQsj_NYO0goeI4e_RuUYehqb28G5A3Uw6Smnkc7VROMWEuK7BV4-kAyOdOjmFaZ83ARSXbS3-8nHxpUHV5OKTsTnFHFPhpD0z4"
              isLive={true}
              progress={50}
            />
          </div>
        </section>

        {/* B2B Section */}
        <section className="py-32 safe-area text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-headlines font-black text-white mb-8 italic">Own Your Network.</h2>
            <p className="text-xl text-on-surface-variant mb-12 leading-relaxed">
              Are you a content creator, filmmaker, or community leader? Start your own independent channel on Chitlin’ Network and reach a global audience with full control over your content and revenue.
            </p>
            <Link href="/start-a-channel" className="inline-flex bg-primary text-on-primary px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-105 transition-all">
              Apply for a Channel
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
