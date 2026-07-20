import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

export function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/shop?search=${encodeURIComponent(query.trim())}` : '/shop');
  };

  return (
    <section className="relative overflow-hidden bg-botanical">
      <motion.div
        className="pointer-events-none absolute -left-16 top-10 text-8xl opacity-20"
        animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌿
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -right-10 top-32 text-7xl opacity-20"
        animate={{ y: [0, 16, 0], rotate: [3, -3, 3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌸
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/4 text-6xl opacity-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        🍃
      </motion.div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sage-700"
        >
          <Sparkles size={13} /> Grown, dried, and blended with care
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance font-display text-4xl leading-tight text-sage-900 sm:text-5xl md:text-6xl"
        >
          Remedies rooted in nature,
          <br />
          chosen by how you feel.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-xl text-balance text-lg text-ink-600"
        >
          Tell us what's bothering you — a headache, restless nights, a stubborn cold — and we'll point
          you to the herbs traditionally used to help. Every product ships with its full ingredient
          list and a look at the garden it came from.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-8 flex w-full max-w-lg items-center gap-2 rounded-full border border-cream-300 bg-cream-50 p-2 shadow-soft"
        >
          <Search size={18} className="ml-3 shrink-0 text-ink-600/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'headache', 'sleep', or 'turmeric'..."
            className="w-full bg-transparent px-1 py-2 text-sm text-ink-800 placeholder:text-ink-600/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-700"
          >
            Find relief
          </button>
        </motion.form>
      </div>
    </section>
  );
}
