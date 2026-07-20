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
          <h2 className="mt-3 font-display text-3xl leading-snug sm:text-4xl">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {['🌿', '🌾', '🌸', '🍃', '🌻', '🪴'].map((leaf, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-2xl bg-sage-700/60 text-4xl"
            >
              {leaf}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
