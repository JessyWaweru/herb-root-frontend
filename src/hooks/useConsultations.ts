import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bookConsultation,
  fetchConsultation,
  fetchConsultations,
  fetchExpert,
  fetchExperts,
  type BookingPayload,
} from '../lib/consultations';
import { useAuthStore } from '../stores/authStore';
import type { ExpertKind } from '../types';

export function useExperts(kind?: ExpertKind) {
  return useQuery({ queryKey: ['experts', kind ?? 'all'], queryFn: () => fetchExperts(kind) });
}

export function useExpert(slug: string | undefined) {
  return useQuery({ queryKey: ['expert', slug], queryFn: () => fetchExpert(slug as string), enabled: Boolean(slug) });
}

export function useConsultations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ queryKey: ['consultations'], queryFn: fetchConsultations, enabled: isAuthenticated });
}

export function useConsultation(reference: string | undefined) {
  return useQuery({
    queryKey: ['consultation', reference],
    queryFn: () => fetchConsultation(reference as string),
    enabled: Boolean(reference),
  });
}

export function useBookConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingPayload) => bookConsultation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['consultations'] }),
  });
}
