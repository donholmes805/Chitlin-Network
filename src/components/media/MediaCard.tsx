import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MediaCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  aspectRatio?: 'video' | 'poster' | 'channel';
  isLive?: boolean;
  isPremium?: boolean;
  progress?: number; // 0 to 100
  className?: string;
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
}: MediaCardProps) {
  const aspectClass = {
    video: 'aspect-video',
    poster: 'aspect-[2/3]',
    channel: 'aspect-[16/6]', // Wider for channel highlights
  }[aspectRatio];

  return (
    <div className={cn("group cursor-pointer flex flex-col", className)}>
      <div className={cn(
        "media-card relative",
        aspectClass
      )}>
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="animate-live-pulse bg-secondary-container text-white text-[10px] px-2 py-0.5 rounded font-bold tracking-widest">
              LIVE
            </span>
          </div>
        )}

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
              Premium
            </span>
          </div>
        )}

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-white text-6xl drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_circle
          </span>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-highest">
            <div 
              className="h-full bg-secondary-container transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
