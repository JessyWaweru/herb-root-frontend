import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useRegister } from '../../hooks/useAuth';

const schema = z.object({
  first_name: z.string().min(1, 'Enter your first name'),
  last_name: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  newsletter_opt_in: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export function Register() {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { newsletter_opt_in: true } });

  return (
    <AuthLayout title="Create your account" subtitle="Save your basket, track orders, and get remedy recommendations.">
      <form onSubmit={handleSubmit((values) => registerMutation.mutate(values))} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" {...register('first_name')} error={errors.first_name?.message} />
          <Input label="Last name" {...register('last_name')} />
        </div>
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" {...register('newsletter_opt_in')} className="h-4 w-4 rounded border-cream-300 text-sage-600" />
          Send me seasonal remedies &amp; growing notes
        </label>
        <Button type="submit" size="lg" isLoading={registerMutation.isPending}>
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
