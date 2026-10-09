import { useState } from 'react';
import clsx from 'clsx';
import { useExperts } from '../../hooks/useConsultations';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ExpertCard } from '../../components/experts/ExpertCard';
import { WhatsAppButton } from '../../components/experts/WhatsAppButton';
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-sage-900">Talk to an expert</h1>
        <p className="mt-3 text-ink-700">
          Not sure which remedy is right for you? Book a one-to-one session with one of our herbal coaches, or with a
          licensed medical specialist, by WhatsApp, phone or video.
        </p>
        <WhatsAppButton message="Hi GOherbal, I have a quick question about your remedies." label="Quick question? WhatsApp us" className="mt-5" />
      </div>

      <div className="mt-10 flex gap-2 overflow-x-auto">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setKind(filter.kind)}
            className={clsx(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              kind === filter.kind ? 'bg-sage-600 text-cream-50' : 'bg-cream-200 text-ink-700 hover:bg-sage-100',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
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
            action={<WhatsAppButton message="Hi GOherbal, I'd like advice on a remedy." />}
          />
        )}
      </div>

      <p className="mt-12 max-w-3xl text-xs text-ink-600">
        Herbal coaches share guidance on traditional remedies and wellbeing; this isn't a medical diagnosis. For
        diagnosis or treatment, book a medical specialist or see your doctor. In an emergency, go to the nearest
        hospital.
      </p>
    </div>
  );
}
