import { MapPin } from 'lucide-react';
import type { ProductDetail } from '../../types';
import { resolveMediaUrl } from '../../lib/format';

export function PlantGardenAlbum({ product }: { product: ProductDetail }) {
  const { plant_origin, plant_gallery_images } = product;
  if (!plant_origin && plant_gallery_images.length === 0) return null;

  return (
    <div className="rounded-3xl border border-cream-300 bg-cream-50 p-6">
      <h3 className="font-display text-xl text-sage-900">From the garden</h3>

      {plant_origin && (
        <div className="mt-3 flex items-start gap-2 text-sm text-ink-700">
          <MapPin size={16} className="mt-0.5 shrink-0 text-sage-600" />
          <div>
            <p className="font-semibold text-sage-900">
              {plant_origin.name}
              {plant_origin.region ? `, ${plant_origin.region}` : ''} — {plant_origin.country}
            </p>
            {plant_origin.description && <p className="mt-1 text-ink-600">{plant_origin.description}</p>}
          </div>
        </div>
      )}

      {plant_gallery_images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {plant_gallery_images.map((img) => (
            <figure key={img.id} className="overflow-hidden rounded-xl">
              <img src={resolveMediaUrl(img.image_url)} alt={img.caption} className="aspect-square w-full object-cover" />
              {img.caption && <figcaption className="mt-1 text-xs text-ink-600">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
