import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import { changePassword } from '../../lib/auth';
import { meetsPasswordRules } from '../../lib/passwordRules';
import { Button } from '../ui/Button';
import { PasswordInput } from '../ui/PasswordInput';
import { ConfirmDialog } from '../ui/Dialog';
import { PasswordChecklist } from '../auth/PasswordChecklist';
import { useSecurityErrorHandler } from './useLockoutHandler';

const schema = z
  .object({
    old_password: z.string().min(1, 'Enter your current password'),
    new_password: z.string().refine(meetsPasswordRules, 'Your new password doesn’t meet all the rules below'),
    confirm_password: z.string(),
  })
  .refine((v) => v.new_password === v.confirm_password, { path: ['confirm_password'], message: 'Passwords don’t match' })
  .refine((v) => v.new_password !== v.old_password, { path: ['new_password'], message: 'Choose a different password from your current one' });

type PasswordForm = z.infer<typeof schema>;

export function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PasswordForm | null>(null);
  const [saving, setSaving] = useState(false);
  const handleError = useSecurityErrorHandler();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(schema) });

  const close = () => {
    reset();
    setOpen(false);
  };

  const save = async () => {
    if (!pending) return;
    setSaving(true);
    try {
      const data = await changePassword(pending.old_password, pending.new_password);
      toast.success(data.detail, { duration: 6000 });
      setPending(null);
      close();
    } catch (error) {
      setPending(null);
      handleError(error, 'Could not change your password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-sage-900">Password</h2>
          {!open && <p className="mt-0.5 text-xs text-ink-600">Click Change password to set a new one.</p>}
        </div>
        {!open && (
          <Button size="sm" variant="outline" icon={<KeyRound size={14} />} onClick={() => setOpen(true)}>
            Change password
          </Button>
        )}
      </div>

      {open && (
        <form onSubmit={handleSubmit(setPending)} className="mt-4 flex flex-col gap-4 sm:max-w-sm">
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            {...register('old_password')}
            error={errors.old_password?.message}
          />
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            {...register('new_password')}
            error={errors.new_password?.message}
          />
          <PasswordChecklist password={watch('new_password') ?? ''} />
          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />
          <div className="flex gap-3">
            <Button type="submit">Update password</Button>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Change your password?"
        message="You'll stay signed in here, but every other device will be signed out. We'll also email you to let you know."
        confirmLabel="Yes, change it"
        isLoading={saving}
        onConfirm={save}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
