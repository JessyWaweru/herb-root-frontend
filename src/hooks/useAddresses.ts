import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createAddress, deleteAddress, fetchAddresses, updateAddress } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import { apiErrorMessage } from '../lib/api';
import type { Address } from '../types';

const ADDRESSES_KEY = ['addresses'];

export function useAddresses() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ queryKey: ADDRESSES_KEY, queryFn: fetchAddresses, enabled: isAuthenticated });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Address, 'id' | 'created_at'>) => createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      toast.success('Address saved.');
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Address> }) => updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      toast.success('Address updated.');
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      toast.success('Address removed.');
    },
  });
}
