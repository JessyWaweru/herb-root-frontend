import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Turnstile, type TurnstileHandle } from '../../components/auth/Turnstile';
import { requestPasswordReset } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [botToken, setBotToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: FormValues) => {
    if (!botToken) return;
    setLoading(true);
    try {
      await requestPasswordReset(email, botToken);
      setSent(true);
    } catch (error) {
      turnstile.current?.reset();
      toast.error(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to choose a new one.">
      {sent ? (
        <p className="text-ink-700">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            inputMode="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Turnstile ref={turnstile} action="password-reset" onToken={setBotToken} />
          <Button type="submit" size="lg" isLoading={loading} disabled={!botToken}>
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-sm text-ink-600">
        <Link to="/login" className="font-semibold text-sage-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
