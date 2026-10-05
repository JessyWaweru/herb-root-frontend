import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { PasswordChecklist } from '../../components/auth/PasswordChecklist';
import { VerifyCodeForm } from '../../components/auth/VerifyCodeForm';
import { Turnstile, type TurnstileHandle } from '../../components/auth/Turnstile';
import { useCompleteSignIn, useRegister } from '../../hooks/useAuth';
import { apiErrorMessage } from '../../lib/api';
import { offerToSavePassword } from '../../lib/credentials';
import { meetsPasswordRules } from '../../lib/passwordRules';
import type { PendingVerification } from '../../lib/auth';

const schema = z.object({
  first_name: z.string().trim().min(1, 'Enter your first name').max(150),
  last_name: z.string().trim().max(150).optional(),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().max(128).refine(meetsPasswordRules, "Your password doesn't meet all the requirements yet"),
  newsletter_opt_in: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export function Register() {
  const registerMutation = useRegister();
  const completeSignIn = useCompleteSignIn();
  const [pending, setPending] = useState<PendingVerification | null>(null);
  const [botToken, setBotToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { newsletter_opt_in: true } });
  const password = watch('password') ?? '';

  const onSubmit = (values: FormValues) => {
    if (!botToken) return;
    registerMutation.mutate({ ...values, turnstile_token: botToken }, {
      onSuccess: (data) => {
        offerToSavePassword(data.email, values.password, values.first_name);
        setPending(data);
      },
      onError: (error) => {
        turnstile.current?.reset();
        const fieldErrors = axios.isAxiosError(error) ? error.response?.data : undefined;
        let mapped = false;
        if (fieldErrors && typeof fieldErrors === 'object') {
          for (const field of ['first_name', 'last_name', 'email', 'password'] as const) {
            const message = fieldErrors[field];
            if (message) {
              setError(field as Path<FormValues>, { message: Array.isArray(message) ? message.join(' ') : message });
              mapped = true;
            }
          }
        }
        if (!mapped) toast.error(apiErrorMessage(error, 'Could not create your account.'));
      },
    });
  };

  if (pending) {
    return (
      <AuthLayout title="Check your email" subtitle="One last step to protect your account.">
        <VerifyCodeForm
          email={pending.email}
          initialResendIn={pending.resend_in}
          onVerified={(data) => completeSignIn(data, 'welcome')}
          onBack={() => setPending(null)}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Save your basket, track orders, and get remedy recommendations.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            autoComplete="given-name"
            {...register('first_name')}
            error={errors.first_name?.message}
          />
          <Input
            label="Last name (optional)"
            autoComplete="family-name"
            {...register('last_name')}
            error={errors.last_name?.message}
          />
        </div>
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            aria-describedby="password-rules"
            {...register('password')}
            error={errors.password?.message}
          />
          <PasswordChecklist password={password} id="password-rules" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" {...register('newsletter_opt_in')} className="h-4 w-4 rounded border-cream-300 text-sage-600" />
          Send me seasonal remedies &amp; growing notes
        </label>
        <Turnstile ref={turnstile} action="signup" onToken={setBotToken} />
        <Button type="submit" size="lg" isLoading={registerMutation.isPending} disabled={!botToken}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-sage-700 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
