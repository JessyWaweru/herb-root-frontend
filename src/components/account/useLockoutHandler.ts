import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { setSignOutNotice } from '../../lib/signOutNotice';

/** Shows an API error. If too many wrong passwords locked the account, the server has
 * already signed it out everywhere, so this browser follows and goes to sign in. */
export function useSecurityErrorHandler() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return (error: unknown, fallback: string) => {
    const message = apiErrorMessage(error, fallback);
    if (axios.isAxiosError(error) && error.response?.data?.code === 'account_locked') {
      // A toast is easy to miss during the redirect, so the sign-in page explains it instead.
      setSignOutNotice(message);
      clearAuth();
      navigate('/login', { replace: true });
      return;
    }
    toast.error(message, { duration: 6000 });
  };
}
