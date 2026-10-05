import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function GardenStory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 rounded-[2.5rem] bg-sage-800 p-8 text-cream-50 sm:p-14 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-gold-400">From seed to shelf</span>
          <h2 className="mt-3 font-display text-3xl leading-snug text-cream-50 sm:text-4xl">
            Every product tells you exactly which garden it grew in.
          </h2>
          <p className="mt-4 max-w-md text-sm text-cream-100/85">
            Open any remedy and you'll find its full ingredient list, a small photo album of the plant
            growing in its home soil, and a plain-language note on what it's traditionally used for —
            no guesswork, no vague marketing.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gold-400"
          >
            Explore the garden
          </Link>
        </motion.div>

        <div>
          <div className="grid h-80 grid-cols-3 grid-rows-3 gap-2.5 sm:h-[26rem]">
            {PHOTOS.map((photo, i) => (
              <motion.figure
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
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PHOTOS = [
  {
    name: 'Lavender',
    src: '/images/garden/lavender.webp',
    alt: 'A bumblebee feeding on purple lavender blossoms',
    span: 'row-span-2',
    focus: '40% center',
    author: 'Martin Falbisoner',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bumblebee_on_Lavender_Blossom.JPG',
  },
  {
    name: 'Echinacea',
    src: '/images/garden/echinacea.webp',
    alt: 'A pink echinacea coneflower in bloom',
    span: '',
    focus: 'center 30%',
    author: 'Gzen92',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:%C3%89chinac%C3%A9e_pourpre_(Echinacea_purpurea)_(2).jpg',
  },
  {
    name: 'Chamomile',
    src: '/images/garden/chamomile.webp',
    alt: 'White chamomile flowers with yellow centres',
    span: '',
    focus: 'center',
    author: 'kallerna',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Kamomillasaunio_(Matricaria_recutita).JPG',
  },
  {
    name: 'Hibiscus (roselle)',
    src: '/images/garden/hibiscus.webp',
    alt: 'A cream roselle hibiscus flower with a deep red centre',
    span: 'col-span-2',
    focus: 'center 40%',
    author: 'Horacio Cambeiro',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Roselle_flower_(Hibiscus_Sabdariffa)_in_Capiov%C3%AD.jpg',
  },
  {
    name: 'Moringa',
    src: '/images/garden/moringa.webp',
    alt: 'Clusters of small white moringa blossoms',
    span: 'col-span-2',
    focus: 'center 35%',
    author: 'Ramesh Kunnappully',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Moringa_oleifera_flowers_20231217_095210_01.jpg',
  },
  {
    name: 'Turmeric',
    src: '/images/garden/turmeric.webp',
    alt: 'A pale green turmeric flower among its leaves',
    span: '',
    focus: 'center',
    author: 'Manojk',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Curcuma_longa_flower.jpg',
  },
];
