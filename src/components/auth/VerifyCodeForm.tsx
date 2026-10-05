import { useEffect, useRef, useState } from 'react';
import { MailCheck } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { resendVerificationEmail, verifyEmailCode, type AuthResponse } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';

const LENGTH = 6;

export function VerifyCodeForm({
  email,
  initialResendIn,
  onVerified,
  onBack,
}: {
  email: string;
  initialResendIn: number;
  onVerified: (data: AuthResponse) => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(initialResendIn);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  const submit = async (code: string) => {
    if (code.length !== LENGTH || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      onVerified(await verifyEmailCode(email, code));
    } catch (err) {
      setError(apiErrorMessage(err, 'That code is incorrect or has expired.'));
      const tooMany = axios.isAxiosError(err) && err.response?.data?.code === 'too_many_attempts';
      setDigits(Array(LENGTH).fill(''));
      if (!tooMany) inputs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const fill = (start: number, value: string) => {
    const chars = value.replace(/\D/g, '').slice(0, LENGTH - start).split('');
    if (chars.length === 0) return;
    const next = [...digits];
    chars.forEach((c, i) => (next[start + i] = c));
    setDigits(next);
    setError('');
    const focusAt = Math.min(start + chars.length, LENGTH - 1);
    inputs.current[focusAt]?.focus();
    const code = next.join('');
    if (code.length === LENGTH) submit(code);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      const next = [...digits];
      next[i - 1] = '';
      setDigits(next);
      inputs.current[i - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const { resend_in } = await resendVerificationEmail(email);
      setResendIn(resend_in);
      setDigits(Array(LENGTH).fill(''));
      setError('');
      inputs.current[0]?.focus();
      toast.success('A new code is on its way.');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not resend the code right now.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(digits.join(''));
      }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-sage-200 bg-sage-50 p-4">
        <MailCheck size={20} className="mt-0.5 shrink-0 text-sage-700" />
        <p className="text-sm text-ink-700">
          We sent a 6-digit code to <span className="break-all font-semibold text-sage-900">{email}</span>. It
          expires in 10 minutes.
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink-700">Verification code</legend>
        <div className="flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={digit}
              onChange={(e) => fill(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => {
                e.preventDefault();
                fill(0, e.clipboardData.getData('text'));
              }}
              onFocus={(e) => e.target.select()}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={LENGTH}
              aria-label={`Digit ${i + 1} of ${LENGTH}`}
              aria-invalid={Boolean(error)}
              disabled={submitting}
              className={clsx(
                'h-14 w-full min-w-0 rounded-xl border bg-cream-50 text-center font-display text-2xl text-sage-900 transition',
                'focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400',
                error ? 'border-rose-400' : digit ? 'border-sage-400' : 'border-cream-300',
              )}
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-xs text-rose-600">
            {error}
          </p>
        )}
      </fieldset>

      <Button type="submit" size="lg" isLoading={submitting} disabled={digits.join('').length !== LENGTH}>
        Verify &amp; continue
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="font-medium text-ink-600 hover:text-ink-800">
          ← Use a different email
        </button>
        {resendIn > 0 ? (
          <span className="text-ink-600">Resend in {resendIn}s</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-semibold text-sage-700 hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        )}
      </div>
    </form>
  );
}
