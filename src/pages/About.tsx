import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, MapPinned, ShieldCheck, Sprout } from 'lucide-react';
import { Button } from '../components/ui/Button';

const VALUES = [
  { icon: Sprout, title: 'Grown with intention', desc: 'Every herb is cultivated on partner farms across Kenya, never mass-synthesized.' },
  { icon: MapPinned, title: 'Traced to the source', desc: 'We show you the garden — literally — behind every remedy on the shelf.' },
  { icon: ShieldCheck, title: 'Honest labeling', desc: 'Full ingredient lists, plain-language notes on what each herb is traditionally used for.' },
];

export function About() {
  return (
    <div>
      <section className="bg-botanical px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sage-700">
            <Leaf size={13} /> Our story
          </span>
          <h1 className="mx-auto max-w-2xl font-display text-4xl text-sage-900 sm:text-5xl">
            We believe a remedy should tell you where it came from.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-ink-600">
            Herb & Root started with a simple frustration: most "natural" products online tell you
            almost nothing about what's actually inside, or where it grew. So we built a shop where
            every product carries its full story — ingredients, origin, and purpose.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl border border-cream-300 bg-cream-50 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg text-sage-900">{title}</h3>
              <p className="mt-2 text-sm text-ink-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl text-sage-900">Ready to find what helps?</h2>
        <p className="mt-3 text-ink-600">Search by symptom or browse the full shop.</p>
        <Link to="/shop">
          <Button size="lg" className="mt-6">Explore remedies</Button>
        </Link>
      </section>
    </div>
  );
}
