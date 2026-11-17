import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSymptoms } from '../../hooks/useProducts';
import { ConcernCard } from '../concerns/ConcernCard';
import { ConcernGridSkeleton } from '../ui/Skeleton';
import { SectionHeading } from '../ui/SectionHeading';
import { buttonClasses } from '../ui/buttonStyles';

const HOME_PREVIEW_COUNT = 8;

export function SymptomGrid() {
  const { data: symptoms, isLoading } = useSymptoms();
  const preview = symptoms?.slice(0, HOME_PREVIEW_COUNT);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading
        eyebrow="Shop by concern"
        title={
          <>
            What are you <em>feeling</em> today?
          </>
        }
        description="Pick what's on your mind and we'll surface the remedies traditionally used for it."
        action={
          <Link to="/concerns" className={buttonClasses('outline')}>
            Browse all concerns
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        }
      />

      {isLoading ? (
        <ConcernGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {preview?.map((symptom, i) => (
            <ConcernCard key={symptom.id} concern={symptom} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
