import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GARDEN_PHOTOS as PHOTOS } from '../../lib/gardenPhotos';
import { ButtonLink } from '../ui/Button';
import { Eyebrow } from '../ui/SectionHeading';
import { PhotoCredits } from '../art/PhotoCredits';
import { Sprig } from '../art/Botanical';

/** `storyLink` is off on the story page itself, where the link would point at the page you're on. */
export function GardenStory({ storyLink = true }: { storyLink?: boolean }) {
  return (
    <section className="mx-auto max-w-[90rem] px-3 py-10 sm:px-6 lg:px-8">
      <div className="bg-forest relative grid items-center gap-12 overflow-hidden rounded-[2.5rem] px-6 py-12 text-cream-50 sm:px-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-20 lg:py-24">
        <Sprig className="pointer-events-none absolute -left-12 -top-10 h-80 rotate-[150deg] text-sage-300/15" leaves={8} />

        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <Eyebrow dark>From seed to shelf</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-4xl leading-[1.04] text-cream-50 sm:text-5xl lg:text-[3.5rem]">
            Every product grew in one place: <em className="font-normal italic text-sage-300">our Senses Garden.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-cream-100/85">
            Our herbs are grown at the Senses Garden, tended at home.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink to="/shop" variant="secondary" size="lg">
              Explore the remedies
              <ArrowRight size={17} aria-hidden="true" />
            </ButtonLink>
            {storyLink && (
              <Link to="/about" className="link-sweep text-sm font-semibold text-cream-50 hover:text-gold-400">
                Read our story
              </Link>
            )}
          </div>
        </m.div>

        <div className="relative">
          <div className="grid h-[22rem] grid-cols-3 grid-rows-3 gap-3 sm:h-[30rem]">
            {PHOTOS.map((photo, i) => (
              <m.figure
                key={photo.name}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.07 * i, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative overflow-hidden rounded-3xl ring-1 ring-cream-50/10 ${photo.span}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  style={{ objectPosition: photo.focus }}
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-sage-950/75 to-transparent px-4 pb-3 pt-10 font-display text-sm italic tracking-wide text-cream-50">
                  {photo.name}
                </figcaption>
              </m.figure>
            ))}
          </div>
          {/* The CC BY-SA licences require visible credit, a licence link and the source. */}
          <PhotoCredits photos={PHOTOS} className="mt-4 text-cream-100/75" linkClassName="hover:text-gold-400" />
        </div>
      </div>
    </section>
  );
}
