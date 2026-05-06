'use client';

import { useEffect, useRef } from 'react';
import { VideoProvider } from '@/types';

interface VideoPlayerProps {
  provider: VideoProvider;
  videoUrl: string;
  videoId?: string;
  posterUrl?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ 
  provider, 
  videoUrl, 
  videoId, 
  posterUrl, 
  autoPlay = false 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Verification: Ensure we have the necessary ID/URL
  const isMissingContent = !videoUrl && !videoId;

  if (isMissingContent) {
    return (
      <div className="aspect-video w-full bg-surface-container flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 animate-pulse">videocam_off</span>
        <p className="text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Content Currently Unavailable</p>
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
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://customer-XXXXX.cloudflarestream.com/${videoId}/iframe?autoplay=${autoPlay}`}
            className="w-full h-full border-none"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
            allowFullScreen
          />
        </div>
      );

    case 'mux':
      return (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          {/* Mux integration usually uses their custom element, but iframe for simple POC */}
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
            className="w-full h-full"
          />
          {!autoPlay && !videoRef.current?.played.length && (
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
