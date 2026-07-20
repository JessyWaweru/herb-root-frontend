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
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={clsx(i < rounded ? 'fill-gold-500 text-gold-500' : 'fill-transparent text-cream-300')}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-ink-600">{value.toFixed(1)}</span>}
      {typeof count === 'number' && <span className="text-xs text-ink-600">({count})</span>}
    </div>
  );
}
