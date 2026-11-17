import { useIngredients } from '../../hooks/useProducts';
import { GARDEN_PHOTOS } from '../../lib/gardenPhotos';
import { BrandLeaf } from '../art/Botanical';

const FALLBACK = GARDEN_PHOTOS.map((photo) => photo.name);

/** A slow ticker of the herbs that go into our remedies, between the hero and the rest of the page. */
export function HerbMarquee() {
  const { data: ingredients } = useIngredients();
  const names = ingredients && ingredients.length >= 4 ? ingredients.map((i) => i.name) : FALLBACK;
  // Short lists are repeated so the strip is always wider than the screen.
  const strip = names.length < 10 ? [...names, ...names] : names;

  return (
    <section aria-label="Herbs in our remedies" className="bg-forest relative overflow-hidden py-5 text-cream-50">
      <ul className="sr-only">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div className="mask-fade-x flex" aria-hidden="true">
        <div className="flex w-max shrink-0 animate-marquee items-center hover:[animation-play-state:paused]">
          {[...strip, ...strip].map((name, i) => (
            <span key={i} className="flex items-center gap-9 pr-9">
              <span className="whitespace-nowrap font-display text-2xl italic tracking-wide text-cream-50/95 sm:text-[1.75rem]">{name}</span>
              <BrandLeaf className="h-5 text-gold-500" veins={false} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
