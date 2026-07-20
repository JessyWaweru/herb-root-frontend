import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSymptoms } from '../../hooks/useProducts';
import { Spinner } from '../ui/Spinner';

export function SymptomGrid() {
  const { data: symptoms, isLoading } = useSymptoms();

  return (
    <section id="symptoms" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">Shop by concern</span>
        <h2 className="mt-2 font-display text-3xl text-sage-900">What are you feeling today?</h2>
        <p className="mt-2 max-w-md text-sm text-ink-600">
          Pick what's on your mind and we'll surface the remedies traditionally used for it.
        </p>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {symptoms?.map((symptom, i) => (
            <motion.div
              key={symptom.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Link
                to={`/shop?symptom=${symptom.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-cream-300 bg-cream-50 px-3 py-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-sage-300 hover:shadow-lift"
              >
                <span className="text-3xl">{symptom.icon || '🌿'}</span>
                <span className="text-sm font-semibold text-sage-900">{symptom.name}</span>
                <span className="text-xs text-ink-600/70">{symptom.product_count} remedies</span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
