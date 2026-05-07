import Link from 'next/link';

interface ChannelCardProps {
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
  href?: string;
  id?: string; // Support legacy id prop if needed
}

export default function ChannelCard({ name, description, imageUrl, category = 'General', href, id }: ChannelCardProps) {
  const finalHref = href || `/channels/${id || 'default'}`;

  return (
    <Link href={finalHref} className="group relative block aspect-[16/10] overflow-hidden transition-all duration-700">
      {/* Background Image — Refined Scaling */}
      <div className="absolute inset-0 z-0 feather-mask-all opacity-60 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out">
        <img 
          src={imageUrl} 
          alt={name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598897611553-d68a8819752e?auto=format&fit=crop&q=80&w=1000';
          }}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent group-hover:via-background/40 transition-all duration-700" />
      </div>

      {/* Content — Professional Spacing */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-sm shadow-sm backdrop-blur-sm">
              {category}
            </span>
          </div>
          
          <h3 className="text-2xl font-headlines font-black text-white italic tracking-tighter group-hover:text-gold transition-colors duration-500 leading-none">
            {name}
          </h3>
          
          <p className="text-xs text-on-surface-variant line-clamp-2 max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 leading-relaxed font-medium">
            {description}
          </p>
          
          <div className="pt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
            View Channel
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Subtle Hover Glow */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/10 transition-all duration-700 pointer-events-none" />
    </Link>
  );
}
