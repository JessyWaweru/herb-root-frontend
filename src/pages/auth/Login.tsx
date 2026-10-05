import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { VerifyCodeForm } from '../../components/auth/VerifyCodeForm';
import { useCompleteSignIn, useLogin } from '../../hooks/useAuth';
import { offerToSavePassword } from '../../lib/credentials';
import type { PendingVerification } from '../../lib/auth';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').max(128),
});
type FormValues = z.infer<typeof schema>;

export function Login() {
  const [pending, setPending] = useState<PendingVerification | null>(null);
  const completeSignIn = useCompleteSignIn();
  const login = useLogin({ onNeedsVerification: setPending });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) =>
    login.mutate(values, {
      onSuccess: (data) => {
        offerToSavePassword(values.email, values.password, data.user.first_name);
        completeSignIn(data, 'welcome-back');
      },
    });

  if (pending) {
    return (
      <AuthLayout title="Verify your email" subtitle="Confirm it's you to finish signing in.">
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
    <AuthLayout title="Welcome back" subtitle="Sign in to reach your basket, orders and wishlist.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs font-semibold text-sage-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" isLoading={login.isPending}>
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-600">
        New here?{' '}
        <Link to="/register" className="font-semibold text-sage-700 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
