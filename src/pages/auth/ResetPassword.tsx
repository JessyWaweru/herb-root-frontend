import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { PasswordChecklist } from '../../components/auth/PasswordChecklist';
import { meetsPasswordRules } from '../../lib/passwordRules';
import { confirmPasswordReset } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';

const schema = z.object({
  new_password: z
    .string()
    .max(128)
    .refine(meetsPasswordRules, "Your password doesn't meet all the requirements yet"),
});
type FormValues = z.infer<typeof schema>;

export function ResetPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const password = watch('new_password') ?? '';

  const onSubmit = async ({ new_password }: FormValues) => {
    if (!uid || !token) return;
    setLoading(true);
    try {
      await confirmPasswordReset(uid, token, new_password);
      toast.success('Password reset. Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'This reset link is invalid or has expired.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            aria-describedby="password-rules"
            {...register('new_password')}
            error={errors.new_password?.message}
          />
          <PasswordChecklist password={password} id="password-rules" />
        </div>
        <Button type="submit" size="lg" isLoading={loading}>
          Reset password
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-600">
        <Link to="/login" className="font-semibold text-sage-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
