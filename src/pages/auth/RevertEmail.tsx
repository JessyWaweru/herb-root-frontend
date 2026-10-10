import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { revertEmailChange } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

// Acts only on a click: mail scanners open links automatically, and that must not trigger a revert.
export function RevertEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const secure = async () => {
    setLoading(true);
    try {
      const data = await revertEmailChange(token);
      clearAuth();
      setResult({ ok: true, message: data.detail });
    } catch (error) {
      setResult({ ok: false, message: apiErrorMessage(error, 'This link is invalid or has expired.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Secure your account" subtitle="Undo an email change you didn't make.">
      {result ? (
        <div className="flex flex-col gap-4">
          <p className={result.ok ? 'text-ink-700' : 'text-rose-600'}>{result.message}</p>
          {!result.ok && (
            <p className="text-sm text-ink-600">
              Need help? Email{' '}
              <a href="mailto:hello@goherbal.health" className="font-semibold text-sage-700 underline">
                hello@goherbal.health
              </a>
              .
            </p>
          )}
        </div>
      ) : !token ? (
        <p className="text-rose-600">This link is incomplete. Open it again from the email we sent you.</p>
      ) : (
        <div className="flex flex-col gap-4 text-sm text-ink-700">
          <p>This will:</p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>put your account's email back to this address,</li>
            <li>sign everyone out of your account, on every device,</li>
            <li>email you a link to set a new password.</li>
          </ul>
          <Button size="lg" isLoading={loading} icon={<ShieldCheck size={17} />} onClick={secure}>
            Secure my account
          </Button>
        </div>
      )}
      <p className="mt-6 text-sm text-ink-600">
        <Link to="/login" className="font-semibold text-sage-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
