import { m } from 'framer-motion';
import { Sprig } from '../art/Botanical';
import { gardenPhotoFor } from '../../lib/gardenPhotos';
import type { Ingredient } from '../../types';

/** One herb named in a concern's guide: garden photo (credited, as its licence requires) or a leaf. */
export function HerbCard({ herb, index = 0 }: { herb: Ingredient; index?: number }) {
  const photo = gardenPhotoFor(herb.name);
  return (
    <m.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="card group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sage-100 via-sage-50 to-gold-200">
        {photo ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ objectPosition: photo.focus }}
          />
        ) : (
          <span className="flex h-full items-center justify-center" aria-hidden="true">
            <span className="absolute aspect-square h-[70%] rounded-full bg-cream-50/60" />
            <Sprig className="relative h-[78%] animate-leaf-sway text-sage-600" leaves={5} />
          </span>
        )}
      </div>
      <figcaption className="flex flex-1 flex-col gap-1.5 p-6">
        <span className="font-display text-2xl leading-tight text-sage-900">{herb.name}</span>
        {herb.description && <span className="text-sm leading-relaxed text-ink-600">{herb.description}</span>}
        {photo && (
          <span className="mt-auto pt-3 text-[11px] leading-snug text-ink-600">
            Photo:{' '}
            <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-sage-700">
              {photo.name}
            </a>{' '}
            by {photo.author},{' '}
            <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline hover:text-sage-700">
              {photo.license}
            </a>
          </span>
        )}
      </figcaption>
    </m.figure>
  );
}
