import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { GARDEN_PHOTOS as PHOTOS } from '../../lib/gardenPhotos';

export function GardenStory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 rounded-[2.5rem] bg-sage-800 p-8 text-cream-50 sm:p-14 md:grid-cols-2">
        <m.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-gold-400">From seed to shelf</span>
          <h2 className="mt-3 font-display text-3xl leading-snug text-cream-50 sm:text-4xl">
            Every product grew in one place: our Senses Garden.
          </h2>
          <p className="mt-4 max-w-md text-sm text-cream-100/85">
            Our herbs are grown at the Senses Garden, tended at home.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gold-400"
          >
            Explore the remedies
          </Link>
        </m.div>

        <div>
          <div className="grid h-80 grid-cols-3 grid-rows-3 gap-2.5 sm:h-[26rem]">
            {PHOTOS.map((photo, i) => (
              <m.figure
                key={photo.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className={`relative overflow-hidden rounded-2xl ${photo.span}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: photo.focus }}
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2 pt-6 text-[11px] font-medium italic tracking-wide text-cream-50/95">
                  {photo.name}
                </figcaption>
              </m.figure>
            ))}
          </div>
          {/* The CC BY-SA licences require visible credit, a licence link and the source. */}
          <p className="mt-3 text-[11px] leading-relaxed text-cream-100/85">
            Photos (cropped):{' '}
            {PHOTOS.map((photo, i) => (
              <span key={photo.name}>
                <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-400">
                  {photo.name}
                </a>{' '}
                by {photo.author},{' '}
                <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline hover:text-gold-400">
                  {photo.license}
                </a>
                {i < PHOTOS.length - 1 ? '; ' : '. '}
              </span>
            ))}
            Via Wikimedia Commons.
          </p>
        </div>
      </div>
    </section>
  );
}
