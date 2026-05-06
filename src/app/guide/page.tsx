import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProgramGuide from "@/components/media/ProgramGuide";

export default function GuidePage() {
  const categories = ["All Networks", "Global News", "Live Sports", "Indie Cinema", "Urban Music", "Faith \u0026 Spirit", "Comedy Central", "Talk \u0026 Culture"];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      <main className="flex-grow pt-40 pb-32">
        {/* Cinematic Guide Header */}
        <section className="safe-area mb-20 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-4xl space-y-6">
               <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-8 py-3 rounded-full">
                  <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Real-Time Broadcast Schedule</span>
                </div>
              <h1 className="text-6xl md:text-8xl font-headlines font-black italic tracking-tighter text-white leading-none">
                Program <br/>
                <span className="text-gold">Guide.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed editorial-text">
                Discover the pulse of independent Black excellence. Navigate 150+ verified channels across the network.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3 text-on-surface-variant">
               <div className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel border-white/5">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                  <span className="text-xs font-black uppercase tracking-[0.3em]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
               </div>
               <p className="text-[9px] font-bold text-outline uppercase tracking-widest">Network Time: {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} EST</p>
            </div>
          </div>

          {/* Premium Category Navigation */}
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, i) => (
              <button 
                key={i}
                className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap border ${
                  i === 0 
                  ? "bg-primary text-on-primary border-primary shadow-[0_10px_30px_rgba(242,202,80,0.3)] scale-105" 
                  : "bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* EPG Grid — Cinematic Transformation */}
        <section className="safe-area relative">
          <div className="absolute -top-40 left-0 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none" />
          <ProgramGuide />
          
          {/* Legend / Status Bar */}
          <div className="mt-16 flex justify-center">
            <div className="glass-panel px-10 py-6 rounded-[2rem] border-white/5 flex flex-wrap justify-center items-center gap-12 shadow-2xl">
              <div className="flex items-center gap-3 group">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(177,15,15,0.6)]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-white transition-colors">On Air Now</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(242,202,80,0.6)]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-white transition-colors">Network Premiere</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="w-2.5 h-2.5 rounded-full bg-outline shadow-[0_0_10px_rgba(140,98,57,0.4)]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-white transition-colors">Archive Replay</span>
              </div>
              <div className="hidden md:block h-6 w-px bg-white/10"></div>
              <button className="text-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">tune</span>
                Personalize Feed
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
