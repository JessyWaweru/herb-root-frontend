import { MapPin } from 'lucide-react';
import type { ProductDetail } from '../../types';
import { resolveMediaUrl } from '../../lib/format';
import { Eyebrow } from '../ui/SectionHeading';
import { Sprig } from '../art/Botanical';

export function PlantGardenAlbum({ product }: { product: ProductDetail }) {
  const { plant_origin, plant_gallery_images } = product;
  if (!plant_origin && plant_gallery_images.length === 0) return null;

  return (
    <div className="bg-forest relative h-fit overflow-hidden rounded-[2.25rem] p-7 text-cream-50 sm:p-9">
      <Sprig className="pointer-events-none absolute -right-8 -top-8 h-64 rotate-[28deg] text-sage-300/20" leaves={7} />
      <div className="relative">
        <Eyebrow dark>Where it grew</Eyebrow>
        <h2 className="mt-4 font-display text-3xl leading-tight text-cream-50">From the garden</h2>

        {plant_origin && (
          <div className="mt-5 flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-50/10 text-gold-400">
              <MapPin size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-cream-50">
                {plant_origin.name}
                {plant_origin.region ? `, ${plant_origin.region}` : ''} — {plant_origin.country}
              </p>
              {plant_origin.description && <p className="mt-1 text-sm leading-relaxed text-cream-100/80">{plant_origin.description}</p>}
            </div>
          </div>
        )}

        {plant_gallery_images.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {plant_gallery_images.map((img, i) => (
              <figure key={img.id}>
                <img
                  src={resolveMediaUrl(img.image_url)}
                  alt={img.caption || `Garden photo ${i + 1} of the plant used in ${product.name}`}
                  loading="lazy"
                  className="aspect-square w-full rounded-2xl object-cover ring-1 ring-cream-50/10"
                />
                {img.caption && <figcaption className="mt-1.5 text-xs text-cream-100/75">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
