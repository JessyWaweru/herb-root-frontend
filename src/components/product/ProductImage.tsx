import clsx from 'clsx';
import { resolveMediaUrl } from '../../lib/format';
import { Sprig } from '../art/Botanical';

const TINTS = [
  { panel: 'from-sage-100 to-sage-50', disc: 'bg-sage-200/70', sprig: 'text-sage-600' },
  { panel: 'from-gold-200 to-cream-100', disc: 'bg-gold-300/60', sprig: 'text-gold-700' },
  { panel: 'from-rose-100 to-cream-100', disc: 'bg-rose-300/45', sprig: 'text-rose-600' },
  { panel: 'from-cream-200 to-sage-50', disc: 'bg-sage-100', sprig: 'text-sage-700' },
] as const;

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/** True for the stand-in picture the API sends when a product has no photo yet. */
const isPlaceholder = (src: string) => !src || src.includes('/placeholders/');

/**
 * A product's photo. Products without one yet get a drawn sprig on a tinted panel instead of
 * the API's generic stand-in, so a shelf of new products still looks deliberate; `seed`
 * (the product id) keeps each product's panel the same everywhere it appears.
 */
export function ProductImage({
  src,
  alt = '',
  seed = '',
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt?: string;
  seed?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  if (isPlaceholder(src)) {
    const h = hash(seed || alt);
    const tint = TINTS[h % TINTS.length];
    const tilt = ((h >> 3) % 25) - 12;
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={clsx('relative flex items-center justify-center overflow-hidden bg-gradient-to-br', tint.panel, className)}
      >
        <span className={clsx('absolute aspect-square w-[62%] rounded-full', tint.disc)} />
        <span className="absolute aspect-square w-[78%] rounded-full border border-dashed border-current opacity-15" />
        <Sprig
          leaves={4 + (h % 4)}
          className={clsx('relative h-[66%] transition-transform duration-700 ease-out group-hover:scale-105', tint.sprig, imgClassName)}
          // Each product leans its own way.
          style={{ rotate: `${tilt}deg` }}
        />
      </div>
    );
  }

  return (
    <div className={clsx('relative overflow-hidden bg-sage-50', className)}>
      <img
        src={resolveMediaUrl(src)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={clsx('h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
