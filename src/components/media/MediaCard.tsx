import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MediaCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  aspectRatio?: 'video' | 'poster' | 'wide';
  isLive?: boolean;
  isPremium?: boolean;
  progress?: number; // 0 to 100
  className?: string;
  rating?: string;
}

export default function MediaCard({
  title,
  subtitle,
  imageUrl,
  aspectRatio = 'video',
  isLive = false,
  isPremium = false,
  progress,
  className,
  rating = 'TV-MA',
}: MediaCardProps) {
  const aspectClass = {
    video: 'aspect-video',
    poster: 'aspect-[2/3]',
    wide: 'aspect-[21/9]',
  }[aspectRatio];

  return (
    <div className={cn("group cursor-pointer flex flex-col", className)}>
      <div className={cn(
        "relative overflow-hidden rounded-xl bg-surface-container-high transition-all duration-700 border border-white/5 group-hover:border-primary/30 group-hover:-translate-y-1.5 shadow-xl group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]",
        aspectClass,
        "min-h-[180px]"
      )}>
        {/* Fallback Branded Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest to-background flex items-center justify-center">
          <span className="material-symbols-outlined text-white/5 text-8xl scale-150 rotate-12 select-none">
            {aspectRatio === 'poster' ? 'movie' : 'play_circle'}
          </span>
        </div>

        <img 
          src={imageUrl} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out z-10"
        />
        
        {/* Cinematic Master Overlay — Refined Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700 z-20" />

        {/* Live Indicator — Refined Professional Style */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-secondary/90 backdrop-blur-md px-2.5 py-1 rounded-sm shadow-xl border border-white/10">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <span className="text-white text-[8px] font-black uppercase tracking-[0.2em] leading-none">
              On Air
            </span>
          </div>
        )}

        {/* Premium/Rating Badge — Sleeker Presentation */}
        <div className="absolute top-3 right-3 flex gap-1.5">
           {isPremium && (
             <div className="bg-primary/90 backdrop-blur-md text-on-primary text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-lg">
               Premium
             </div>
           )}
           <div className="bg-black/40 backdrop-blur-md text-on-surface-variant text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border border-white/5">
             {rating}
           </div>
        </div>

        {/* Play Icon — Refined Pro Style */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/95 text-on-primary flex items-center justify-center shadow-[0_0_40px_rgba(242,202,80,0.3)] hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>

        {/* Progress Bar — Subtle Neon */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 backdrop-blur-sm">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>
      
      {/* Content Info — Investor-Grade Typography */}
      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-2">
           <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1 flex-grow tracking-tight">
             {title}
           </h3>
           <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors text-lg">more_vert</span>
        </div>
        
        {subtitle && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/80 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
