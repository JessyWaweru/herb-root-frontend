import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { ProductDetail } from '../../types';
import { resolveMediaUrl } from '../../lib/format';

export function ProductGallery({ product }: { product: ProductDetail }) {
  const images = [
    { id: 'primary', image_url: product.primary_image_url, alt_text: product.name },
    ...product.gallery_images,
  ];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-3xl border border-cream-300 bg-sage-50">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]?.id ?? active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            src={resolveMediaUrl(images[active]?.image_url ?? '')}
            alt={images[active]?.alt_text || product.name}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={clsx(
                'h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition',
                active === i ? 'border-sage-600' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={resolveMediaUrl(img.image_url)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
