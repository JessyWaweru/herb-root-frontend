
import { m } from 'framer-motion';
import { Leaf, MapPinned, ShieldCheck, Sprout } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { CRUMBS } from '../seo/site';

const VALUES = [
  { icon: Sprout, title: 'Grown with intention', desc: 'Every herb is grown in our own Senses Garden, never mass-synthesized.' },
  { icon: MapPinned, title: 'Traced to the source', desc: 'Every remedy on the shelf comes from the Senses Garden, and we show you the plants behind it.' },
  { icon: ShieldCheck, title: 'Honest labeling', desc: 'Full ingredient lists, plain-language notes on what each herb is traditionally used for.' },
];

export function About() {
  return (
    <div>
      <section className="bg-botanical px-4 pb-20 pt-10 text-center sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS['/about']} className="mx-auto mb-10 max-w-6xl text-left" />
        <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sage-700">
            <Leaf size={13} /> Our story
          </span>
          <h1 className="mx-auto max-w-2xl font-display text-4xl text-sage-900 sm:text-5xl">
            We believe a remedy should tell you where it came from.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-ink-600">
            GOherbal started with a simple frustration: most "natural" products online tell you
            almost nothing about what's actually inside, or where it grew. So we built a shop where
            every product carries its full story — ingredients, origin, and purpose.
          </p>
        </m.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl border border-cream-300 bg-cream-50 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 font-display text-lg text-sage-900">{title}</h2>
              <p className="mt-2 text-sm text-ink-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl text-sage-900">Ready to find what helps?</h2>
        <p className="mt-3 text-ink-600">Search by symptom or browse the full shop.</p>
        <ButtonLink to="/shop" size="lg" className="mt-6">Explore remedies</ButtonLink>
      </section>
    </div>
  );
}
