import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSymptoms } from '../../hooks/useProducts';
import { ConcernCard } from '../concerns/ConcernCard';
import { Spinner } from '../ui/Spinner';

const HOME_PREVIEW_COUNT = 8;

export function SymptomGrid() {
  const { data: symptoms, isLoading } = useSymptoms();
  const preview = symptoms?.slice(0, HOME_PREVIEW_COUNT);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
          {preview?.map((symptom, i) => (
            <ConcernCard key={symptom.id} concern={symptom} index={i} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          to="/concerns"
          className="inline-flex items-center gap-1.5 rounded-full border border-sage-300 px-5 py-2.5 text-sm font-semibold text-sage-800 transition hover:bg-sage-50"
        >
          Browse all concerns
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
