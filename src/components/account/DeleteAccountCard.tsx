import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { deleteAccount, fetchDeletionBlockers } from '../../lib/auth';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Spinner } from '../ui/Spinner';
import { useSecurityErrorHandler } from './useLockoutHandler';

const schema = z.object({
  password: z.string().min(1, 'Enter your current password'),
  confirm: z.string().refine((v) => v.trim().toUpperCase() === 'DELETE', 'Type DELETE to confirm'),
});
type DeleteForm = z.infer<typeof schema>;

export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleError = useSecurityErrorHandler();
  const blockers = useQuery({ queryKey: ['deletion-blockers'], queryFn: fetchDeletionBlockers, enabled: open, staleTime: 0 });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteForm>({ resolver: zodResolver(schema) });

  const close = () => {
    reset();
    setOpen(false);
  };

  const onDelete = async (values: DeleteForm) => {
    setDeleting(true);
    try {
      await deleteAccount(values.password, values.confirm);
      clearAuth();
      queryClient.clear();
      toast.success('Your account has been deleted. Take care!', { duration: 6000 });
      navigate('/', { replace: true });
    } catch (error) {
      handleError(error, 'Could not delete your account.');
      blockers.refetch();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-300 bg-rose-300/10 p-6">
      <h2 className="font-display text-lg text-sage-900">Delete account</h2>
      <p className="mt-1 text-sm text-ink-700">
        Permanently erase your account and personal details. This can't be undone.
      </p>
      <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setOpen(true)} className="mt-4">
        Delete my account
      </Button>

      <Dialog open={open} onClose={close} title="Delete your account?">
        {blockers.isLoading ? (
          <Spinner />
        ) : blockers.data && blockers.data.length > 0 ? (
          <div className="flex flex-col gap-4 text-sm text-ink-700">
            <p>You can delete your account once these are finished:</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 font-semibold text-ink-800">
              {blockers.data.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <p>This makes sure you don't lose track of anything you've paid for.</p>
            <div className="flex justify-end">
              <Button onClick={close}>OK</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onDelete)} className="flex flex-col gap-4 text-sm text-ink-700">
            <div>
              <p className="font-semibold text-ink-800">We'll permanently erase:</p>
              <p>your name, email, phone, password, saved addresses, basket, wishlist, reviews and consultation notes.</p>
            </div>
            <div>
              <p className="font-semibold text-ink-800">We'll keep:</p>
              <p>a record of past purchases (items and amounts only, without your name or address), because the law requires it.</p>
            </div>
            <p>You'll be signed out everywhere. You can sign up again later with the same email.</p>
            <PasswordInput
              label="Current password"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Input label="Type DELETE to confirm" autoComplete="off" {...register('confirm')} error={errors.confirm?.message} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={close}>
                Keep my account
              </Button>
              <Button type="submit" variant="danger" isLoading={deleting}>
                Delete forever
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
