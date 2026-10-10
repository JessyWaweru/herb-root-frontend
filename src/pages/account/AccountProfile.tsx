import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { ProfileDetailsCard } from '../../components/account/ProfileDetailsCard';
import { ChangePasswordCard } from '../../components/account/ChangePasswordCard';
import { resendVerificationEmail } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';

export function AccountProfile() {
  const user = useAuthStore((s) => s.user);
  const [resending, setResending] = useState(false);

  const onResend = async () => {
    if (!user) return;
    setResending(true);
    try {
      await resendVerificationEmail(user.email);
      toast.success('Verification email sent.');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not resend verification email.'));
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
      <ProfileDetailsCard />
      <ChangePasswordCard />
    </div>
  );
}
