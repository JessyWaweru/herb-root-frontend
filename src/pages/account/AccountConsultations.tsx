import { Link } from 'react-router-dom';
import { useConsultations } from '../../hooks/useConsultations';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/format';
import type { ConsultationStatus } from '../../types';

const STATUS_TONE: Record<ConsultationStatus, 'sage' | 'gold' | 'rose'> = {
  pending_payment: 'gold',
  confirmed: 'sage',
  scheduled: 'sage',
  completed: 'sage',
  cancelled: 'rose',
  refunded: 'rose',
};

export function AccountConsultations() {
  const { data: consultations, isLoading } = useConsultations();

  if (isLoading) return <Spinner />;

  if (!consultations || consultations.length === 0) {
    return (
      <EmptyState
        icon="🩺"
        title="No consultations yet"
        description="Book a session with a herbal coach or medical specialist."
        action={
          <Link to="/experts">
            <Button>Talk to an expert</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {consultations.map((consultation) => (
        <Link
          key={consultation.id}
          to={`/consultations/${consultation.reference}`}
          className="flex items-center justify-between rounded-2xl border border-cream-300 bg-cream-50 p-5 transition hover:border-sage-300"
        >
          <div>
            <p className="font-semibold text-sage-900">{consultation.expert.name}</p>
            <p className="text-sm text-ink-600">
              {consultation.reference} · {formatDate(consultation.scheduled_for ?? consultation.preferred_time)}
            </p>
          </div>
          <Badge tone={STATUS_TONE[consultation.status]}>{consultation.status_label}</Badge>
        </Link>
      ))}
    </div>
  );
}
