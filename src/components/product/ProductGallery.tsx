import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { ProductDetail } from '../../types';
import { ProductImage } from './ProductImage';

export function ProductGallery({ product }: { product: ProductDetail }) {
  const images = [
    { id: 'primary', image_url: product.primary_image_url, alt_text: product.name },
    ...product.gallery_images,
  ];
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-[2.25rem] border border-cream-300 bg-sage-50 shadow-soft">
        <AnimatePresence mode="wait">
          <m.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full w-full"
          >
            <ProductImage src={current.image_url} alt={current.alt_text || product.name} seed={product.id} eager className="h-full w-full" />
          </m.div>
        </AnimatePresence>
        {product.is_bestseller && (
          <span className="absolute left-5 top-5 rounded-full bg-gold-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-900 shadow-soft">
            Bestseller
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto p-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-pressed={active === i}
              className={clsx(
                'h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition duration-200',
                active === i ? 'ring-2 ring-sage-800 ring-offset-2 ring-offset-cream-100' : 'opacity-60 hover:opacity-100',
              )}
            >
              <ProductImage src={img.image_url} seed={product.id} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
