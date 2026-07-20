import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLogin } from '../../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export function Login() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to reach your basket, orders and wishlist.">
      <form onSubmit={handleSubmit((values) => login.mutate(values))} className="flex flex-col gap-4">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
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
