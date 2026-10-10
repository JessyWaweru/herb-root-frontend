import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, MapPin, Navigation, Package, Phone } from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/Dialog';
import { PageSpinner } from '../components/ui/Spinner';
import { fetchRiderDelivery, updateRiderDelivery, type RiderDelivery as Delivery } from '../lib/delivery';
import { apiErrorMessage } from '../lib/api';

type Action = 'picked-up' | 'delivered';

const ACTION_COPY: Record<Action, { button: string; confirm: string; message: string }> = {
  'picked-up': {
    button: 'I’ve picked it up',
    confirm: 'Picked up the order?',
    message: 'The customer will be told you’re on your way, with your name and number.',
  },
  delivered: {
    button: 'Delivered',
    confirm: 'Handed over to the customer?',
    message: 'Only confirm once the customer has the order. This link stops working afterwards.',
  },
};

/** The page a rider opens from their SMS link. No login: the link is the key. */
export function RiderDelivery() {
  const { token = '' } = useParams<{ token: string }>();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['rider-delivery', token],
    queryFn: () => fetchRiderDelivery(token),
    retry: false,
  });
  const [confirming, setConfirming] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Delivery | null>(null);

  const act = async () => {
    if (!confirming) return;
    setBusy(true);
    setError('');
    try {
      const updated = await updateRiderDelivery(token, confirming);
      if (updated.status === 'delivered') setDone(updated);
      else await refetch();
    } catch (err) {
      setError(apiErrorMessage(err, 'That didn’t go through. Check your connection and try again.'));
      refetch();
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  };

  if (isLoading) return <PageSpinner />;

  if (done) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 size={56} className="text-sage-600" />
          <h1 className="font-display text-2xl text-sage-900">Delivered — thank you, {done.rider_name}!</h1>
          <p className="text-ink-700">Order {done.order_number} is complete. You can close this page.</p>
        </div>
      </Shell>
    );
  }

  if (isError || !data) {
    return (
      <Shell>
        <div className="py-10 text-center">
          <h1 className="font-display text-2xl text-sage-900">This delivery link isn’t active</h1>
          <p className="mt-2 text-ink-700">
            The delivery may be finished or given to another rider. If you think that’s wrong, call the GOherbal team.
          </p>
        </div>
      </Shell>
    );
  }

  const address = [data.address_line1, data.address_line2, data.city].filter(Boolean).join(', ');
  const next: Action = data.status === 'out_for_delivery' ? 'delivered' : 'picked-up';

  return (
    <Shell>
      <p className="text-sm text-ink-600">Hi {data.rider_name} · Order {data.order_number}</p>
      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
          data.status === 'out_for_delivery' ? 'bg-sage-100 text-sage-800' : 'bg-gold-300/50 text-gold-600'
        }`}
      >
        {data.status === 'out_for_delivery' ? 'On the way' : 'Ready for pickup at the shop'}
      </span>

      {!data.is_paid && (
        <p className="mt-4 rounded-xl bg-rose-300/40 p-3 text-sm font-semibold text-rose-600">
          Not paid yet. Don’t deliver. Call the GOherbal team.
        </p>
      )}

      <section className="mt-5 rounded-2xl border border-cream-300 bg-cream-50 p-5">
        <p className="text-xs uppercase tracking-wide text-ink-600">Customer</p>
        <p className="mt-1 font-display text-xl text-sage-900">{data.full_name}</p>
        <a
          href={`tel:${data.phone_number}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-sage-600 py-3 text-base font-semibold text-cream-50"
        >
          <Phone size={18} /> Call {data.phone_number}
        </a>
      </section>

      <section className="mt-4 rounded-2xl border border-cream-300 bg-cream-50 p-5">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-600">
          <MapPin size={13} /> Drop-off
        </p>
        <p className="mt-1 text-base text-ink-800">{address}</p>
        {data.landmark && (
          <p className="mt-2 rounded-lg bg-gold-300/30 p-2 text-sm text-ink-800">
            <span className="font-semibold">Directions:</span> {data.landmark}
          </p>
        )}
        {data.directions_url && (
          <a
            href={data.directions_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-sage-600 py-3 text-base font-semibold text-sage-800"
          >
            <Navigation size={18} /> Navigate in Google Maps
          </a>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-cream-300 bg-cream-50 p-5">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-600">
          <Package size={13} /> Package
        </p>
        <ul className="mt-1 text-sm text-ink-800">
          {data.items.map((item) => (
            <li key={item.name}>
              {item.quantity} × {item.name}
            </li>
          ))}
        </ul>
        {data.is_paid && <p className="mt-2 text-sm font-semibold text-sage-700">Already paid. Nothing to collect.</p>}
      </section>

      {error && <p className="mt-4 rounded-xl bg-rose-300/40 p-3 text-sm text-rose-600">{error}</p>}

      <Button size="lg" className="mt-6 w-full" disabled={!data.is_paid} onClick={() => setConfirming(next)}>
        {ACTION_COPY[next].button}
      </Button>

      <ConfirmDialog
        open={confirming !== null}
        title={confirming ? ACTION_COPY[confirming].confirm : ''}
        message={confirming ? ACTION_COPY[confirming].message : ''}
        confirmLabel="Yes"
        isLoading={busy}
        onConfirm={act}
        onCancel={() => setConfirming(null)}
      />
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b border-cream-300 bg-cream-50 px-4 py-3">
        <Logo />
      </header>
      <main className="mx-auto max-w-md px-4 py-6">{children}</main>
    </div>
  );
}
