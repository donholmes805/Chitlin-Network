import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProgramGuide from "@/components/media/ProgramGuide";

export default function GuidePage() {
  const categories = ["All", "News", "Sports", "Music", "Comedy", "Faith", "Culture", "Movies", "Talk Shows"];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-12">
        {/* Header Section */}
        <section className="safe-area py-12 bg-gradient-to-b from-surface-container-low to-background">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-headlines font-bold mb-2 text-primary italic">Channel Guide</h1>
              <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                Real-time scheduling for Black excellence. Discover the pulse of the community through our curated live network.
              </p>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant font-bold">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="text-sm uppercase tracking-widest">Sunday, Nov 24, 2024</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-10 flex flex-wrap gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, i) => (
              <button 
                key={i}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap border-2 ${
                  i === 0 
                  ? "bg-primary text-on-primary border-primary shadow-lg scale-105" 
                  : "bg-surface-container border-white/5 text-on-surface hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* EPG Grid Section */}
        <section className="safe-area pb-24">
          <ProgramGuide />
          
          {/* Legend */}
          <div className="mt-8 flex justify-center">
            <div className="glass-panel px-8 py-4 rounded-full flex flex-wrap justify-center items-center gap-8 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Live Now</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Premiere</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/20"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Replay</span>
              </div>
              <div className="hidden md:block h-4 w-px bg-white/10"></div>
              <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Guide Settings
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
