import { m } from 'framer-motion';
import { ArrowRight, MapPinned, ShieldCheck, Sprout } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { PageHero } from '../components/layout/PageHero';
import { GardenStory } from '../components/home/GardenStory';
import { Eyebrow } from '../components/ui/SectionHeading';
import { LeafRule } from '../components/art/Botanical';
import { CRUMBS } from '../seo/site';

const VALUES = [
  { icon: Sprout, title: 'Grown with intention', desc: 'Every herb is grown in our own Senses Garden, never mass-synthesized.' },
  { icon: MapPinned, title: 'Traced to the source', desc: 'Every remedy on the shelf comes from the Senses Garden, and we show you the plants behind it.' },
  { icon: ShieldCheck, title: 'Honest labeling', desc: 'Full ingredient lists, plain-language notes on what each herb is traditionally used for.' },
];

export function About() {
  return (
    <div>
      <PageHero
        crumbs={CRUMBS['/about']}
        align="center"
        eyebrow="Our story"
        title={
          <>
            We believe a remedy should tell you <em>where it came from.</em>
          </>
        }
        description={
          <>
            GOherbal started with a simple frustration: most "natural" products online tell you almost nothing about
            what's actually inside, or where it grew. So we built a shop where every product carries its full story —
            ingredients, origin, and purpose.
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 flex flex-col items-center text-center">
          <Eyebrow>What we hold to</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-sage-900 sm:text-4xl">
            Three promises, <em className="accent-italic">plainly kept</em>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <m.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="card group relative overflow-hidden p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="absolute right-6 top-5 font-display text-6xl italic leading-none text-sage-100 transition-colors duration-300 group-hover:text-sage-200" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-sage-800 text-gold-400 shadow-press">
                <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="relative mt-7 font-display text-2xl text-sage-900">{title}</h3>
              <p className="relative mt-3 leading-relaxed text-ink-600">{desc}</p>
            </m.div>
          ))}
        </div>
      </section>

      <GardenStory storyLink={false} />

      <section className="mx-auto max-w-3xl px-4 pt-24 text-center sm:px-6 lg:px-8">
        <LeafRule className="mb-12" />
        <h2 className="text-balance font-display text-4xl leading-tight text-sage-900 sm:text-5xl">
          Ready to find <em className="accent-italic">what helps?</em>
        </h2>
        <p className="mt-4 text-lg text-ink-600">Search by symptom or browse the full shop.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/shop" size="lg">
            Explore remedies
            <ArrowRight size={17} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to="/concerns" size="lg" variant="outline">
            Shop by concern
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
