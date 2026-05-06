import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import VideoPlayer from "@/components/media/VideoPlayer";

export default function WatchLive() {
  // Mock data for "Now Playing"
  const nowPlaying = {
    title: "The Front Porch Report",
    channel: "Chitlin' Network Live",
    startTime: "8:00 PM",
    endTime: "9:00 PM",
    description: "Tonight: An exclusive interview with independent filmmakers on the future of Black cinema and digital distribution.",
    isLive: true,
  };

  const upNext = [
    { time: "9:00 PM", title: "Soul Stage: Unplugged", channel: "Soul Stage" },
    { time: "10:00 PM", title: "Night Cap News", channel: "Chitlin' Newsroom" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-12 safe-area">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
          {/* Main Player Area */}
          <div className="lg:col-span-3 space-y-6">
            <VideoPlayer 
              provider="mp4" 
              videoUrl="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
              autoPlay={true}
              posterUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuA7yh6ziQfYK8KyphwidbzMXHSLN1GoJy8vzEs99zNfeBTOkdkIvwlvJSuAg3ktl0a_RWAwYouZxCzRPhbhhWtDgAt_SGnGwusYIKvhSWF_s1NmwhHpNo00FBDRYOJYDTqzOSBmaXE84YMXqPPpXs8b4i0e0wb3rwxbOzi1PUCWqzwbQv0wMpl4d11b3p_qmCg5hIec2ar962EHChi55vBiP481_SlOyFrEFKxY_ZTTJ2lJ0k2kpU0pymPhUxp3l29FWh_jBraXAa4"
            />
            
            <div className="bg-surface-container p-6 rounded-xl border border-white/5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="animate-live-pulse bg-secondary-container text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-widest">LIVE</span>
                    <span className="text-primary font-bold text-sm tracking-widest uppercase">{nowPlaying.channel}</span>
                  </div>
                  <h1 className="text-3xl font-headlines font-bold italic">{nowPlaying.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">share</span>
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    <span>Watchlist</span>
                  </button>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed max-w-3xl">
                {nowPlaying.description}
              </p>
            </div>
          </div>

          {/* Sidebar - Up Next / Guide */}
          <div className="space-y-6">
            <div className="bg-surface-container-high rounded-xl border border-white/5 p-6 h-full">
              <h2 className="text-xl font-headlines mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Up Next
              </h2>
              
              <div className="space-y-6">
                {upNext.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-xs text-primary font-bold tracking-widest mb-1">{item.time}</p>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-on-surface-variant uppercase">{item.channel}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-6 border-t border-white/10">
                <button className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:scale-105 transition-all">
                  Open Program Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
