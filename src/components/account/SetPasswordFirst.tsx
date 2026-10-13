import { Link } from 'react-router-dom';

/** For accounts made with Google: actions that confirm the current password need one set first. */
export function SetPasswordFirst({ action }: { action: string }) {
  return (
    <p className="text-sm text-ink-700">
      You sign in with Google, so your account doesn't have a password yet. To {action}, first{' '}
      <Link to="/forgot-password" className="font-semibold text-sage-700 underline">
        set a password
      </Link>{' '}
      using the reset link we email you.
    </p>
  );
}
