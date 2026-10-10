import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { confirmEmailChange, startEmailChange } from '../../lib/auth';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { useSecurityErrorHandler } from './useLockoutHandler';

type Step = 'confirm' | 'details' | 'code';

const detailsSchema = z.object({
  new_email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your current password'),
});
type DetailsForm = z.infer<typeof detailsSchema>;

export function ChangeEmailDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState<Step>('confirm');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const handleError = useSecurityErrorHandler();
  const form = useForm<DetailsForm>({ resolver: zodResolver(detailsSchema) });

  const close = () => {
    setStep('confirm');
    setCode('');
    form.reset();
    onClose();
  };

  const sendCode = async (values: DetailsForm) => {
    setBusy(true);
    try {
      const data = await startEmailChange(values.new_email, values.password);
      setNewEmail(data.new_email);
      form.resetField('password');
      setStep('code');
      toast.success(data.detail);
    } catch (error) {
      handleError(error, 'Could not start the email change.');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    try {
      const data = await confirmEmailChange(code);
      setUser(data.user);
      toast.success(`Done. Sign in with ${data.user.email} from now on.`, { duration: 6000 });
      close();
    } catch (error) {
      handleError(error, 'That code is incorrect or has expired.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} title="Change your email">
      {step === 'confirm' && (
        <div className="flex flex-col gap-4 text-sm text-ink-700">
          <p>Are you sure you want to change the email on your account?</p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5">
            <li>You'll sign in with the new address from then on.</li>
            <li>Order updates and receipts will go to the new address.</li>
            <li>You'll be signed out on all your other devices.</li>
            <li>We'll email {user?.email} to let you know, with a way to undo it if it wasn't you.</li>
          </ul>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button onClick={() => setStep('details')}>Yes, change it</Button>
          </div>
        </div>
      )}

      {step === 'details' && (
        <form onSubmit={form.handleSubmit(sendCode)} className="flex flex-col gap-4">
          <Input
            label="New email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...form.register('new_email')}
            error={form.formState.errors.new_email?.message}
          />
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <p className="flex items-start gap-2 text-xs text-ink-600">
            <ShieldAlert size={14} className="mt-0.5 shrink-0 text-sage-600" />
            We ask for your password so nobody using your device can take over your account. Too many wrong
            tries will lock the account for 15 minutes.
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" isLoading={busy}>
              Send code
            </Button>
          </div>
        </form>
      )}

      {step === 'code' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.length === 6) confirm();
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-ink-700">
            Enter the 6-digit code we sent to <strong>{newEmail}</strong>. It expires in 10 minutes.
          </p>
          <Input
            label="Code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="text-center font-mono text-2xl tracking-[0.5em]"
          />
          <div className="flex justify-between gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep('details')}>
              Use a different email
            </Button>
            <Button type="submit" isLoading={busy} disabled={code.length !== 6}>
              Confirm change
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
