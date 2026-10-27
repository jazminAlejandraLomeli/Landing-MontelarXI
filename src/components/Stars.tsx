import { siteConfig } from "../config/siteConfig";

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

interface StarsProps {
  rating: number;
  reviews?: number;
  className?: string;
}

// Calificación de 0 a 5 con estrellas parciales (4.7 = cuatro llenas y una al 70%).
export default function Stars({ rating, reviews, className = "" }: StarsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex gap-0.5" role="img" aria-label={`${rating.toFixed(1)} ${siteConfig.labels.starsOf}`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className="relative h-3.5 w-3.5">
              <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full fill-(--color-secondary)/25">
                <path d={STAR} />
              </svg>
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-(--color-secondary)">
                  <path d={STAR} />
                </svg>
              </span>
            </span>
          );
        })}
      </span>
      <span className="text-xs font-medium text-(--color-text)/70">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-xs text-(--color-text)/45">({reviews})</span>}
    </div>
  );
}
