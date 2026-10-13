import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

/** Shows an API error. If too many wrong passwords locked the account, the server has
 * already signed it out everywhere, so this browser follows and goes to sign in. */
export function useSecurityErrorHandler() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return (error: unknown, fallback: string) => {
    const message = apiErrorMessage(error, fallback);
    if (axios.isAxiosError(error) && error.response?.data?.code === 'account_locked') {
      clearAuth();
      // A toast is easy to miss during the redirect, so the sign-in page explains it instead.
      navigate('/login', { replace: true, state: { notice: message } });
      return;
    }
    toast.error(message, { duration: 6000 });
  };
}
