import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { changePassword, resendVerificationEmail, updateMe } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';

interface ProfileForm {
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface PasswordForm {
  old_password: string;
  new_password: string;
}

export function AccountProfile() {
  const { user, setUser } = useAuthStore();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [resending, setResending] = useState(false);

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone_number: user?.phone_number ?? '',
    },
  });

  const passwordForm = useForm<PasswordForm>();

  const onSaveProfile = async (values: ProfileForm) => {
    setSavingProfile(true);
    try {
      const updated = await updateMe(values);
      setUser(updated);
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (values: PasswordForm) => {
    setSavingPassword(true);
    try {
      await changePassword(values.old_password, values.new_password);
      toast.success('Password changed.');
      passwordForm.reset();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not change password.'));
    } finally {
      setSavingPassword(false);
    }
  };

  const onResend = async () => {
    if (!user) return;
    setResending(true);
    try {
      await resendVerificationEmail(user.email);
      toast.success('Verification email sent.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {user && !user.is_email_verified && (
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-gold-400 bg-gold-300/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-700">Your email address isn't verified yet.</p>
          <Button size="sm" variant="secondary" onClick={onResend} isLoading={resending}>
            Resend verification email
          </Button>
        </div>
      )}

      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-sage-900">Profile details</h2>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" {...profileForm.register('first_name')} />
            <Input label="Last name" {...profileForm.register('last_name')} />
          </div>
          <Input label="Phone number" {...profileForm.register('phone_number')} />
          <Input label="Email" value={user?.email ?? ''} disabled />
          <Button type="submit" isLoading={savingProfile} className="w-fit">
            Save changes
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
        <h2 className="font-display text-lg text-sage-900">Change password</h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="mt-4 flex flex-col gap-4 sm:max-w-sm">
          <Input label="Current password" type="password" {...passwordForm.register('old_password', { required: true })} />
          <Input label="New password" type="password" {...passwordForm.register('new_password', { required: true, minLength: 8 })} />
          <Button type="submit" isLoading={savingPassword} className="w-fit">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
