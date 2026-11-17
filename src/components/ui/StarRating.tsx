import { Star } from 'lucide-react';
import clsx from 'clsx';

export function StarRating({
  value,
  size = 16,
  showValue = false,
  count,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-px" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            aria-hidden="true"
            className={clsx(i < rounded ? 'fill-gold-500 text-gold-500' : 'fill-cream-200 text-cream-400')}
          />
        ))}
      </div>
      {showValue && <span className="text-xs font-semibold text-ink-800">{value.toFixed(1)}</span>}
      {typeof count === 'number' && <span className="text-xs text-ink-600">({count})</span>}
    </div>
  );
}
