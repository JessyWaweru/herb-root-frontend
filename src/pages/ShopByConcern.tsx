import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSymptoms } from '../hooks/useProducts';
import { Spinner } from '../components/ui/Spinner';
import { SmartSearchBar } from '../components/search/SmartSearchBar';

export function ShopByConcern() {
  const { data: symptoms, isLoading } = useSymptoms();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">Shop by concern</span>
        <h1 className="mt-1 font-display text-3xl text-sage-900 sm:text-4xl">What are you feeling today?</h1>
        <p className="mt-2 max-w-lg text-sm text-ink-600">
          Tell us how you're feeling in your own words, or pick a concern below — we'll surface the remedies
          traditionally used for it.
        </p>
        <SmartSearchBar
          placeholder="e.g. &quot;I can't sleep and my head hurts&quot;"
          className="mt-6 w-full max-w-lg"
          inputClassName="py-3"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {symptoms?.map((symptom, i) => (
            <motion.div
              key={symptom.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                to={`/shop?symptom=${symptom.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-cream-300 bg-cream-50 px-3 py-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-sage-300 hover:shadow-lift"
              >
                <span className="text-3xl">{symptom.icon || '🌿'}</span>
                <span className="text-sm font-semibold text-sage-900">{symptom.name}</span>
                {symptom.description && (
                  <span className="text-xs text-ink-600/70">{symptom.description}</span>
                )}
                <span className="text-xs font-medium text-sage-600">{symptom.product_count} remedies</span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
