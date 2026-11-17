import { useState } from 'react';
import clsx from 'clsx';
import { useExperts } from '../../hooks/useConsultations';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ExpertCard } from '../../components/experts/ExpertCard';
import { EmailUsButton } from '../../components/experts/EmailUsButton';
import { PageHero } from '../../components/layout/PageHero';
import { CRUMBS } from '../../seo/site';
import type { ExpertKind } from '../../types';

const FILTERS: { kind?: ExpertKind; label: string }[] = [
  { label: 'All experts' },
  { kind: 'herbal_coach', label: 'Herbal coaches' },
  { kind: 'medical_specialist', label: 'Medical specialists' },
];

export function Experts() {
  const [kind, setKind] = useState<ExpertKind | undefined>();
  const { data: experts, isLoading } = useExperts(kind);

  return (
    <div>
      <PageHero
        crumbs={CRUMBS['/experts']}
        eyebrow="One-to-one sessions"
        title={
          <>
            Talk to an <em>expert</em>
          </>
        }
        description="Not sure which remedy is right for you? Book a one-to-one session with one of our herbal coaches, or with a licensed medical specialist, by email, phone or video."
      >
        <EmailUsButton subject="A quick question about your remedies" label="Quick question? Email us" className="mt-7" />
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="no-scrollbar flex gap-2 overflow-x-auto p-1" role="group" aria-label="Filter experts">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setKind(filter.kind)}
              aria-pressed={kind === filter.kind}
              className={clsx(
                'shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200',
                kind === filter.kind
                  ? 'border-sage-800 bg-sage-800 text-cream-50 shadow-press'
                  : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-sage-400 hover:text-sage-900',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <Spinner />
          ) : experts && experts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🌿"
              title="Our experts are joining soon"
              description="We're adding herbal coaches and medical specialists. In the meantime, message us and we'll help."
              action={<EmailUsButton subject="I'd like advice on a remedy" />}
            />
          )}
        </div>

        <p className="mt-12 max-w-3xl rounded-3xl border border-cream-300 bg-cream-50/70 p-5 text-xs leading-relaxed text-ink-600">
          Herbal coaches share guidance on traditional remedies and wellbeing; this isn't a medical diagnosis. For
          diagnosis or treatment, book a medical specialist or see your doctor. In an emergency, go to the nearest
          hospital.
        </p>
      </div>
    </div>
  );
}
