import { useSymptoms } from '../hooks/useProducts';
import { Spinner } from '../components/ui/Spinner';
import { SmartSearchBar } from '../components/search/SmartSearchBar';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { CRUMBS } from '../seo/site';
import { ConcernCard } from '../components/concerns/ConcernCard';

export function ShopByConcern() {
  const { data: symptoms, isLoading } = useSymptoms();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={CRUMBS['/concerns']} />
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">Shop by concern</span>
        <h1 className="mt-1 font-display text-3xl text-sage-900 sm:text-4xl">What are you feeling today?</h1>
        <p className="mt-2 max-w-lg text-sm text-ink-600">
          Tell us how you're feeling in your own words, or pick a concern below — we'll surface the remedies
          traditionally used for it.
        </p>
        <SmartSearchBar
          label="Search by how you feel"
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
            <ConcernCard key={symptom.id} concern={symptom} index={i} showDescription />
          ))}
        </div>
      )}
    </div>
  );
}
