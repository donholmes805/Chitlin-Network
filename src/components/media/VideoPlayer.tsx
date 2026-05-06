'use client';

import { useRef, useState } from 'react';
import { VideoProvider } from '@/types';
import { getPlaceholderByCategory } from '@/lib/media/placeholders';

interface VideoPlayerProps {
  provider: VideoProvider;
  videoUrl: string;
  videoId?: string;
  posterUrl?: string;
  autoPlay?: boolean;
  category?: string;
}

export default function VideoPlayer({ 
  provider, 
  videoUrl, 
  videoId, 
  posterUrl, 
  autoPlay = false,
  category = 'CREATOR'
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const placeholder = getPlaceholderByCategory(category);

  // Verification: Ensure we have the necessary ID/URL
  const isMissingContent = !videoUrl && !videoId;

  if (isMissingContent) {
    return (
      <div className={`aspect-video w-full rounded-2xl bg-gradient-to-br ${placeholder.gradient} flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-black/40 opacity-50" />
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
            {placeholder.icon}
          </span>
          <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-1">{placeholder.label}</p>
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.1em] text-[9px] opacity-60">Broadcast Coming Soon</p>
        </div>
        
        {/* Cinematic Brand Mark */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
           <div className="w-1 h-4 bg-primary rounded-full" />
           <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Chitlin Network TV</span>
        </div>
      </div>
    );
  }

  // Provider Specific Rendering
  switch (provider) {
    case 'youtube':
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&modestbranding=1&rel=0`}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case 'vimeo':
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}`}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case 'cloudflare_stream':
      const subdomain = process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_SUBDOMAIN;
      const baseUrl = subdomain ? `https://${subdomain}.cloudflarestream.com` : `https://iframe.videodelivery.net`;
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`${baseUrl}/${videoId}/iframe?autoplay=${autoPlay}`}
            className="w-full h-full border-none"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
            allowFullScreen
          />
        </div>
      );

    case 'mux':
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://stream.mux.com/${videoId}.m3u8`}
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>
      );

    case 'hls':
    case 'mp4':
    case 'external':
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative group shadow-2xl">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            controls
            autoPlay={autoPlay}
            onPlay={() => setHasPlayed(true)}
            className="w-full h-full"
          />
          {!autoPlay && !hasPlayed && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="material-symbols-outlined text-white text-8xl opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="aspect-video w-full bg-surface-container flex flex-col items-center justify-center rounded-2xl border border-white/5">
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Unsupported Provider: {provider}</p>
        </div>
      );
  }
}
