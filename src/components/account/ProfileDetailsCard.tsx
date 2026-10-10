import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { updateMe } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/Dialog';
import { ChangeEmailDialog } from './ChangeEmailDialog';

const schema = z.object({
  first_name: z.string().trim().min(1, 'Enter your first name').max(150),
  last_name: z.string().trim().max(150),
  phone_number: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === '' || /^\+?[\d\s-]{9,}$/.test(v), 'Enter a valid phone number, e.g. 0712 345 678'),
});

type ProfileForm = z.infer<typeof schema>;

const LABELS: Record<keyof ProfileForm, string> = { first_name: 'First name', last_name: 'Last name', phone_number: 'Phone number' };

export function ProfileDetailsCard() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState<ProfileForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);

  const current: ProfileForm = {
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone_number: user?.phone_number ?? '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({ resolver: zodResolver(schema), values: current });

  if (!user) return null;

  const changes = pending
    ? (Object.keys(LABELS) as (keyof ProfileForm)[]).filter((field) => pending[field] !== current[field])
    : [];

  const review = (values: ProfileForm) => {
    const changed = (Object.keys(LABELS) as (keyof ProfileForm)[]).some((field) => values[field] !== current[field]);
    if (!changed) {
      setEditing(false);
      return;
    }
    setPending(values);
  };

  const save = async () => {
    if (!pending) return;
    setSaving(true);
    try {
      setUser(await updateMe(pending));
      toast.success('Profile updated.');
      setPending(null);
      setEditing(false);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not update your profile.'));
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    reset(current);
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-sage-900">Profile details</h2>
          {!editing && <p className="mt-0.5 text-xs text-ink-600">Click Edit to change your details.</p>}
        </div>
        {!editing && (
          <Button size="sm" variant="outline" icon={<Pencil size={14} />} onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(review)} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" autoComplete="given-name" {...register('first_name')} error={errors.first_name?.message} />
            <Input label="Last name" autoComplete="family-name" {...register('last_name')} error={errors.last_name?.message} />
          </div>
          <Input label="Phone number" type="tel" autoComplete="tel" {...register('phone_number')} error={errors.phone_number?.message} />
          <div className="flex gap-3">
            <Button type="submit">Save changes</Button>
            <Button type="button" variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <Detail label="Name" value={[user.first_name, user.last_name].filter(Boolean).join(' ')} />
          <Detail label="Phone number" value={user.phone_number} />
        </dl>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cream-300 pt-5 text-sm">
        <div>
          <p className="text-ink-600">Email (used to sign in)</p>
          <p className="font-semibold text-ink-800">{user.email}</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setChangingEmail(true)}>
          Change email
        </Button>
      </div>

      <ConfirmDialog
        open={pending !== null}
        title="Save these changes?"
        message={
          <ul className="flex flex-col gap-2">
            {changes.map((field) => (
              <li key={field}>
                <span className="text-ink-600">{LABELS[field]}:</span>{' '}
                <span className="line-through opacity-60">{current[field] || '(empty)'}</span> →{' '}
                <span className="font-semibold text-sage-900">{pending?.[field] || '(empty)'}</span>
              </li>
            ))}
          </ul>
        }
        confirmLabel="Yes, save"
        isLoading={saving}
        onConfirm={save}
        onCancel={() => setPending(null)}
      />
      <ChangeEmailDialog open={changingEmail} onClose={() => setChangingEmail(false)} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-600">{label}</dt>
      <dd className="font-semibold text-ink-800">{value || <span className="font-normal italic text-ink-600">Not set</span>}</dd>
    </div>
  );
}
