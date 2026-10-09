import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useConsultation } from '../../hooks/useConsultations';
import { useVerifyPayment } from '../../hooks/usePayments';
import { PageSpinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { ExpertAvatar } from '../../components/experts/ExpertCard';
import { formatPrice } from '../../lib/format';
import type { ConsultationStatus } from '../../types';

const STATUS_META: Record<ConsultationStatus, { headline: string; tone: string; icon: typeof Clock }> = {
  pending_payment: { headline: 'Awaiting payment', tone: 'text-gold-600 bg-gold-300/40', icon: Clock },
  confirmed: { headline: 'You’re booked in!', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  scheduled: { headline: 'Your session is scheduled', tone: 'text-sage-700 bg-sage-100', icon: CalendarCheck },
  completed: { headline: 'Session completed', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  cancelled: { headline: 'Booking cancelled', tone: 'text-rose-700 bg-rose-300/40', icon: XCircle },
  refunded: { headline: 'Booking refunded', tone: 'text-rose-700 bg-rose-300/40', icon: XCircle },
};

const MODE_LABEL = { email: 'Email consultation', phone: 'Phone call', video: 'Video call' } as const;

const dateTime = (iso: string) => new Intl.DateTimeFormat('en-KE', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));

export function ConsultationDetail() {
  const { reference } = useParams<{ reference: string }>();
  const [params] = useSearchParams();
  const paymentReference = params.get('reference') || params.get('trxref');
  const { data: consultation, isLoading, refetch } = useConsultation(reference);
  const verifyPayment = useVerifyPayment();
  const [verifying, setVerifying] = useState(Boolean(paymentReference));
  const attempted = useRef(false);

  // Coming back from Paystack: confirm the payment before showing the booking.
  useEffect(() => {
    if (paymentReference && !attempted.current) {
      attempted.current = true;
      verifyPayment.mutate(paymentReference, {
        onSettled: async () => {
          await refetch();
          setVerifying(false);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentReference]);

  if (isLoading || verifying) return <PageSpinner />;

  if (!consultation) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-sage-900">Booking not found</h1>
        <Link to="/account/consultations" className="mt-4 inline-block text-sage-700 underline">
          View your consultations
        </Link>
      </div>
    );
  }

  const status = STATUS_META[consultation.status];
  const StatusIcon = status.icon;
  const { expert } = consultation;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-cream-300 bg-cream-50 p-8">
        <div className="flex flex-col items-center text-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full ${status.tone}`}>
            <StatusIcon size={26} />
          </span>
          <h1 className="mt-4 font-display text-2xl text-sage-900">{status.headline}</h1>
          <p className="mt-1 text-sm text-ink-600">Booking {consultation.reference}</p>
          {consultation.status === 'confirmed' && (
            <p className="mt-3 max-w-md text-sm text-ink-700">
              {expert.name} will email you to confirm the exact time{consultation.mode === 'video' ? ' and send the link to join' : ''}.
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 border-t border-cream-300 pt-6">
          <ExpertAvatar expert={expert} />
          <div>
            <p className="font-semibold text-sage-900">{expert.name}</p>
            <p className="text-sm text-ink-600">{expert.title}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 border-t border-cream-300 pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-600">Session</dt>
            <dd className="font-semibold text-ink-800">
              {MODE_LABEL[consultation.mode]} · {expert.session_minutes} min
            </dd>
          </div>
          <div>
            <dt className="text-ink-600">{consultation.scheduled_for ? 'Scheduled for' : 'Your preferred time'}</dt>
            <dd className="font-semibold text-ink-800">{dateTime(consultation.scheduled_for ?? consultation.preferred_time)}</dd>
          </div>
          <div>
            <dt className="text-ink-600">Fee</dt>
            <dd className="font-semibold text-ink-800">
              {Number(consultation.fee) ? formatPrice(consultation.fee, consultation.currency) : 'Free'}
            </dd>
          </div>
          {consultation.meeting_link && (
            <div>
              <dt className="text-ink-600">Video link</dt>
              <dd>
                <a href={consultation.meeting_link} target="_blank" rel="noopener noreferrer" className="font-semibold text-sage-700 underline">
                  Join the call
                </a>
              </dd>
            </div>
          )}
        </dl>

        {consultation.status === 'pending_payment' && (
          <p className="mt-6 rounded-xl bg-gold-300/30 p-3 text-center text-sm text-ink-700">
            Payment hasn't been confirmed yet. If you completed payment, refresh this page in a moment.
          </p>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/experts">
            <Button variant="outline">Browse experts</Button>
          </Link>
          <Link to="/account/consultations">
            <Button>My consultations</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
