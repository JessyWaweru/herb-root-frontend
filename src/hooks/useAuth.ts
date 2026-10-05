import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  fetchMe,
  loginUser,
  logoutUser,
  registerUser,
  type AuthResponse,
  type PendingVerification,
  type RegisterPayload,
} from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import { apiErrorMessage } from '../lib/api';
import { displayName } from '../lib/displayName';

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const query = useQuery({ queryKey: ['me'], queryFn: fetchMe, enabled: isAuthenticated, retry: false });

  // Synced in an effect, not in `select`: writing to the store during render re-renders
  // every subscriber, which re-runs `select`, which writes again - an infinite loop.
  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}

/** Stores the session and returns the user to wherever they were headed before signing in. */
export function useCompleteSignIn() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  return (data: AuthResponse, greeting: 'welcome' | 'welcome-back') => {
    setAuth(data.user);
    queryClient.invalidateQueries();
    const name = displayName(data.user);
    toast.success(greeting === 'welcome' ? `Welcome to GOherbal, ${name}!` : `Welcome back, ${name}`);
    navigate(from ? `${from.pathname}${from.search}` : '/', { replace: true });
  };
}

export function useLogin({ onNeedsVerification }: { onNeedsVerification: (pending: PendingVerification) => void }) {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
    onError: (error) => {
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      if (data?.code === 'email_not_verified') {
        onNeedsVerification({ email: data.email, detail: data.detail, resend_in: Number(data.resend_in) || 60 });
        return;
      }
      toast.error(apiErrorMessage(error, 'Could not sign in. Check your details.'));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUser().catch(() => undefined),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Signed out.');
      navigate('/');
    },
  });
}
