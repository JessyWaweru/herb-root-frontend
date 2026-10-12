import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MailX } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { unsubscribeNewsletter } from '../lib/core';
import { apiErrorMessage } from '../lib/api';

// Acts only on a click: mail scanners open links automatically, and that must not unsubscribe anyone.
export function NewsletterUnsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      const data = await unsubscribeNewsletter(token);
      setResult({ ok: true, message: data.detail });
    } catch (error) {
      setResult({ ok: false, message: apiErrorMessage(error, 'This unsubscribe link is invalid.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Unsubscribe" subtitle="Stop receiving the GOherbal garden letter.">
      {result ? (
        <p className={result.ok ? 'text-ink-700' : 'text-rose-600'}>{result.message}</p>
      ) : !token ? (
        <p className="text-rose-600">This link is incomplete. Open it again from the email we sent you.</p>
      ) : (
        <Button size="lg" isLoading={loading} icon={<MailX size={17} />} onClick={confirm}>
          Unsubscribe me
        </Button>
      )}
      <p className="mt-6 text-sm text-ink-600">
        <Link to="/" className="font-semibold text-sage-700 hover:underline">
          Back to the shop
        </Link>
      </p>
    </AuthLayout>
  );
}
