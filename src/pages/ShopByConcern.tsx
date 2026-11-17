import { useSymptoms } from '../hooks/useProducts';
import { ConcernGridSkeleton } from '../components/ui/Skeleton';
import { SmartSearchBar } from '../components/search/SmartSearchBar';
import { PageHero } from '../components/layout/PageHero';
import { CRUMBS } from '../seo/site';
import { ConcernCard } from '../components/concerns/ConcernCard';

export function ShopByConcern() {
  const { data: symptoms, isLoading } = useSymptoms();

  return (
    <div>
      <PageHero
        crumbs={CRUMBS['/concerns']}
        align="center"
        eyebrow="Shop by concern"
        title={
          <>
            What are you <em>feeling</em> today?
          </>
        }
        description="Tell us how you're feeling in your own words, or pick a concern below — we'll surface the remedies traditionally used for it."
      >
        <SmartSearchBar
          label="Search by how you feel"
          placeholder="e.g. &quot;I can't sleep and my head hurts&quot;"
          className="mt-8 w-full max-w-xl"
          inputClassName="h-14 px-6 shadow-lift"
        />
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {isLoading ? (
          <ConcernGridSkeleton count={12} className="md:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {symptoms?.map((symptom, i) => (
              <ConcernCard key={symptom.id} concern={symptom} index={i} showDescription />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
