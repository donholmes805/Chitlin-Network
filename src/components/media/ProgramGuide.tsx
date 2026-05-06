'use client';

import { ProgramType } from "@/types";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Program {
  title: string;
  startTime: string;
  endTime: string;
  type: ProgramType;
  span: number; // grid col span
  isLive?: boolean;
  progress?: number;
}

interface ChannelSchedule {
  channelName: string;
  channelLogo: string;
  logoBg: string;
  programs: Program[];
}

const TIME_SLOTS = ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

export default function ProgramGuide() {
  const schedules: ChannelSchedule[] = [
    {
      channelName: "Chitlin' Newsroom",
      channelLogo: "CN NEWS",
      logoBg: "bg-secondary-container",
      programs: [
        { title: "Evening Report", startTime: "6:00 PM", endTime: "7:00 PM", type: "news", span: 2, isLive: true, progress: 75 },
        { title: "Global Perspective", startTime: "7:00 PM", endTime: "7:30 PM", type: "news", span: 1 },
        { title: "Town Hall: Future of Media", startTime: "7:30 PM", endTime: "9:00 PM", type: "news", span: 3 },
      ]
    },
    {
      channelName: "Chitlin' Sports Desk",
      channelLogo: "CSD",
      logoBg: "bg-primary-container",
      programs: [
        { title: "HBCU Gameday Preview", startTime: "6:00 PM", endTime: "6:30 PM", type: "sports", span: 1 },
        { title: "Friday Night Lights: Classics", startTime: "6:30 PM", endTime: "8:30 PM", type: "sports", span: 4, isLive: false },
        { title: "Inside the Paint", startTime: "8:30 PM", endTime: "9:00 PM", type: "sports", span: 1 },
      ]
    },
    {
      channelName: "Soul Stage",
      channelLogo: "SOUL",
      logoBg: "bg-tertiary-container",
      programs: [
        { title: "Soul Unplugged: ATL", startTime: "6:00 PM", endTime: "7:30 PM", type: "episode", span: 3, isLive: true, progress: 90 },
        { title: "The Remix: Golden Era", startTime: "7:30 PM", endTime: "8:30 PM", type: "episode", span: 2 },
        { title: "After Hours Jazz", startTime: "8:30 PM", endTime: "9:00 PM", type: "episode", span: 1 },
      ]
    },
    {
      channelName: "Indie Film House",
      channelLogo: "INDIE",
      logoBg: "bg-surface-container-high",
      programs: [
        { title: "Feature Presentation: \"Bridges of Bronze\"", startTime: "6:00 PM", endTime: "9:00 PM", type: "episode", span: 6 },
      ]
    }
  ];

  return (
    <div className="relative rounded-xl border border-white/10 bg-surface-container-lowest overflow-x-auto scrollbar-hide shadow-2xl">
      {/* Time Header */}
      <div className="flex bg-surface-container-highest/50 border-b border-white/10 sticky top-0 z-20">
        <div className="min-w-[240px] p-4 border-r border-white/10 glass-panel sticky left-0 z-30">
          <span className="text-xs font-bold text-primary tracking-widest">CHANNELS</span>
        </div>
        {TIME_SLOTS.slice(0, -1).map((time, i) => (
          <div key={i} className="min-w-[300px] p-4 flex items-center justify-center border-r border-white/10 text-xs font-bold text-on-surface-variant">
            {time}
          </div>
        ))}
      </div>

      {/* Now Indicator Line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-primary/80 z-30 pointer-events-none shadow-[0_0_10px_rgba(242,202,80,0.8)]" style={{ left: '540px' }}>
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-primary"></div>
      </div>

      {/* Grid Rows */}
      <div className="flex flex-col">
        {schedules.map((channel, i) => (
          <div key={i} className="flex border-b border-white/5 hover:bg-white/5 transition-colors group">
            {/* Channel Info */}
            <div className="min-w-[240px] p-4 flex items-center gap-4 border-r border-white/10 bg-surface-container-lowest/80 sticky left-0 z-10 group-hover:bg-surface-container-highest transition-colors">
              <div className={cn(
                "w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center text-on-surface font-black text-[10px] text-center leading-tight shrink-0",
                channel.logoBg
              )}>
                {channel.channelLogo.split(' ').map((word, j) => <div key={j}>{word}</div>)}
              </div>
              <span className="text-sm font-bold truncate">{channel.channelName}</span>
            </div>

            {/* Programs */}
            <div className="flex flex-grow">
              {channel.programs.map((program, j) => (
                <div 
                  key={j} 
                  className="p-1" 
                  style={{ minWidth: `${program.span * 300}px` }}
                >
                  <div className={cn(
                    "h-full w-full rounded-lg p-3 flex flex-col justify-center relative overflow-hidden transition-all cursor-pointer",
                    program.isLive ? "bg-surface-container border-l-4 border-secondary-container hover:scale-[1.02]" : "bg-surface-container-low border border-white/5 opacity-60 hover:opacity-100"
                  )}>
                    {program.isLive && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                        <span className="text-[10px] font-bold text-secondary-container">LIVE</span>
                      </div>
                    )}
                    <h4 className="text-sm font-bold truncate">{program.title}</h4>
                    <p className="text-[10px] text-on-surface-variant">{program.startTime} - {program.endTime}</p>
                    
                    {program.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 h-1 bg-secondary-container" style={{ width: `${program.progress}%` }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
