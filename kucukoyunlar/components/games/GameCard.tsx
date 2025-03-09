export interface GameCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
}

export default function GameCard({
  id,
  title,
  description,
  thumbnailUrl,
  category,
}: GameCardProps) {
  return (
    <div className="game-card">
      <div className="relative w-full h-48 bg-muted">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl font-bold">{title.charAt(0)}</div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
            {category}
          </span>
          <a href={`/games/${id}`} className="btn-accent">
            Oyna
          </a>
        </div>
      </div>
    </div>
  );
} 