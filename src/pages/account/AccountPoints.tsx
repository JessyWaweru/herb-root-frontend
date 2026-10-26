import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Gift, PenLine, Sprout, Ticket } from 'lucide-react';
import { usePoints, useRedeemReward } from '../../hooks/usePoints';
import { useAuthStore } from '../../stores/authStore';
import { updateMe } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';
import { formatDate, resolveMediaUrl } from '../../lib/format';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/Dialog';
import type { Redemption, Reward } from '../../types';

const VOUCHER_STATUS: Record<Redemption['status'], { label: string; tone: 'sage' | 'cream' | 'rose' }> = {
  pending: { label: 'Ready to use', tone: 'sage' },
  fulfilled: { label: 'Used', tone: 'cream' },
  cancelled: { label: 'Cancelled', tone: 'rose' },
};

export function AccountPoints() {
  const { data, isLoading } = usePoints();
  const redeem = useRedeemReward();
  const [confirming, setConfirming] = useState<Reward | null>(null);

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl bg-sage-800 p-6 text-cream-50 sm:p-8" aria-labelledby="balance-heading">
        <h2 id="balance-heading" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cream-100/80">
          <Sprout size={16} aria-hidden="true" /> Garden Points
        </h2>
        <p className="mt-2 font-display text-5xl">{data.balance.toLocaleString()}</p>
        <ul className="mt-4 flex flex-col gap-1 text-sm text-cream-100/85">
          <li>1 point for every KES {data.kes_per_point} you spend, once your order arrives.</li>
          <li>
            {data.review_points} points for an honest review of a remedy you've received, good or bad. A couple of
            sentences is all it takes.
          </li>
        </ul>
      </section>

      {data.to_review.length > 0 && (
        <section aria-labelledby="to-review-heading">
          <h2 id="to-review-heading" className="font-display text-xl text-sage-900">
            Waiting for your review
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.to_review.map((product) => (
              <li key={product.slug} className="flex items-center gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-3">
                <img src={resolveMediaUrl(product.primary_image_url)} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sage-900">{product.name}</p>
                  <Link
                    to={`/shop/${product.slug}#reviews`}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-sage-700 hover:underline"
                  >
                    <PenLine size={13} aria-hidden="true" /> Review for +{data.review_points}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="rewards-heading">
        <h2 id="rewards-heading" className="font-display text-xl text-sage-900">
          Rewards
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {data.rewards.map((reward) => {
            const short = reward.points_cost - data.balance;
            return (
              <li key={reward.id} className="flex flex-col rounded-2xl border border-cream-300 bg-cream-50 p-5">
                <span className="text-2xl" aria-hidden="true">
                  {reward.kind === 'experience' ? '🌿' : '🏷️'}
                </span>
                <h3 className="mt-2 font-display text-lg text-sage-900">{reward.name}</h3>
                {reward.description && <p className="mt-1 text-sm text-ink-600">{reward.description}</p>}
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-cream-200"
                  role="progressbar"
                  aria-label={`Progress towards ${reward.name}`}
                  aria-valuemin={0}
                  aria-valuemax={reward.points_cost}
                  aria-valuenow={Math.min(data.balance, reward.points_cost)}
                >
                  <div
                    className="h-full rounded-full bg-gold-500"
                    style={{ width: `${Math.min(100, (data.balance / reward.points_cost) * 100)}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-sage-800">{reward.points_cost.toLocaleString()} points</span>
                  {short > 0 ? (
                    <span className="text-xs text-ink-600">{short.toLocaleString()} more to go</span>
                  ) : (
                    <Button size="sm" icon={<Gift size={14} />} onClick={() => setConfirming(reward)}>
                      Redeem
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {data.redemptions.length > 0 && (
        <section aria-labelledby="vouchers-heading">
          <h2 id="vouchers-heading" className="font-display text-xl text-sage-900">
            Your vouchers
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            Send your code to us on{' '}
            <Link to="/contact" className="font-semibold text-sage-700 underline">
              the contact page
            </Link>{' '}
            with your next order, or to book your tour.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {data.redemptions.map((redemption) => (
              <li key={redemption.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-4">
                <Ticket size={18} className="text-sage-600" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-sage-900">{redemption.reward_name}</p>
                  <p className="text-xs text-ink-600">{formatDate(redemption.created_at)}</p>
                </div>
                <code className="rounded-lg bg-cream-200 px-2 py-1 font-mono text-sm text-ink-800">{redemption.code}</code>
                <Badge tone={VOUCHER_STATUS[redemption.status].tone}>{VOUCHER_STATUS[redemption.status].label}</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="font-display text-xl text-sage-900">
          History
        </h2>
        {data.entries.length === 0 ? (
          <p className="mt-2 text-sm text-ink-600">No points yet. They'll appear here once an order arrives or you write a review.</p>
        ) : (
          <ul className="mt-3 divide-y divide-cream-300 rounded-2xl border border-cream-300 bg-cream-50">
            {data.entries.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <div>
                  <p className="text-ink-800">{entry.label}</p>
                  <p className="text-xs text-ink-600">{formatDate(entry.created_at)}</p>
                </div>
                <span className={entry.points >= 0 ? 'font-semibold text-sage-700' : 'font-semibold text-rose-600'}>
                  {entry.points >= 0 ? '+' : '−'}
                  {Math.abs(entry.points).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ReviewRemindersSetting />

      <p className="text-xs text-ink-600">
        Points have no cash value and can't be transferred. See the{' '}
        <Link to="/terms#garden-points" className="underline">
          Garden Points terms
        </Link>
        .
      </p>

      <ConfirmDialog
        open={confirming !== null}
        title="Redeem this reward?"
        message={
          confirming && (
            <>
              <strong>{confirming.points_cost.toLocaleString()} points</strong> will be taken from your balance for{' '}
              <strong>{confirming.name}</strong>, and you'll get a voucher code.
            </>
          )
        }
        confirmLabel="Redeem"
        isLoading={redeem.isPending}
        onCancel={() => setConfirming(null)}
        onConfirm={() => confirming && redeem.mutate(confirming.id, { onSettled: () => setConfirming(null) })}
      />
    </div>
  );
}

function ReviewRemindersSetting() {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  if (!user) return null;

  const toggle = async () => {
    setSaving(true);
    try {
      setUser(await updateMe({ review_reminders: !user.review_reminders }));
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not save your choice.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-cream-300 bg-cream-50 p-5" aria-labelledby="reminders-heading">
      <h2 id="reminders-heading" className="font-display text-lg text-sage-900">
        Review reminders
      </h2>
      <label className="mt-2 flex items-start gap-3 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={user.review_reminders}
          onChange={toggle}
          disabled={saving}
          className="mt-0.5 h-4 w-4 rounded border-cream-300 text-sage-600"
        />
        An email a few days after your order arrives, and now and then a quick question here, asking how a remedy worked
        for you.
      </label>
    </section>
  );
}
