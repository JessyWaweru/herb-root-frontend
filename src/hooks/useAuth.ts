import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchMe,
  loginUser,
  logoutUser,
  registerUser,
  type RegisterPayload,
} from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import { apiErrorMessage } from '../lib/api';

export function useCurrentUser() {
  const { accessToken, setUser } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: Boolean(accessToken),
    retry: false,
    select: (data) => {
      setUser(data);
      return data;
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access, data.refresh);
      queryClient.invalidateQueries();
      toast.success(`Welcome back, ${data.user.first_name || data.user.email}`);
      navigate('/account');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not sign in. Check your details.')),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.access, data.refresh);
      toast.success('Account created! Check your email to verify your address.');
      navigate('/account');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not create your account.')),
  });
}

export function useLogout() {
  const { refreshToken, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await logoutUser(refreshToken).catch(() => undefined);
      }
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Signed out.');
      navigate('/');
    },
  });
}
