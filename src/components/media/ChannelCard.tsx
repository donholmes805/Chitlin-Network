interface ChannelCardProps {
  name: string;
  description: string;
  imageUrl: string;
}

export default function ChannelCard({ name, description, imageUrl }: ChannelCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface-container-high h-[200px] cursor-pointer transition-all hover:ring-2 hover:ring-primary">
      <img 
        src={imageUrl} 
        alt={name}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="font-bold text-lg text-white">{name}</h3>
        <p className="text-xs text-on-surface-variant uppercase tracking-wider">{description}</p>
      </div>
    </div>
  );
}
