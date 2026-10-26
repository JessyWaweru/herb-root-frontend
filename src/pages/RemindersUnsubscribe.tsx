import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BellOff } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { stopReviewReminders } from '../lib/points';
import { apiErrorMessage } from '../lib/api';

// Acts only on a click: mail scanners open links automatically, and that must not change anyone's settings.
export function RemindersUnsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      const data = await stopReviewReminders(token);
      setResult({ ok: true, message: data.detail });
    } catch (error) {
      setResult({ ok: false, message: apiErrorMessage(error, 'This link is invalid.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Stop review reminders" subtitle="No more emails or pop-ups asking you to review what you bought.">
      {result ? (
        <p className={result.ok ? 'text-ink-700' : 'text-rose-600'}>{result.message}</p>
      ) : !token ? (
        <p className="text-rose-600">This link is incomplete. Open it again from the email we sent you.</p>
      ) : (
        <Button size="lg" isLoading={loading} icon={<BellOff size={17} />} onClick={confirm}>
          Stop reminders
        </Button>
      )}
      <p className="mt-6 text-sm text-ink-600">
        You can still review and earn points any time, and turn reminders back on from{' '}
        <Link to="/account/points" className="font-semibold text-sage-700 hover:underline">
          your account
        </Link>
        .
      </p>
    </AuthLayout>
  );
}
