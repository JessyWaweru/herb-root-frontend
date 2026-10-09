import { api } from './api';
import type { Consultation, ConsultationMode, Expert, ExpertKind, Paginated } from '../types';

export async function fetchExperts(kind?: ExpertKind) {
  const { data } = await api.get<Expert[]>('/consultations/experts/', { params: kind ? { kind } : undefined });
  return data;
}

export async function fetchExpert(slug: string) {
  const { data } = await api.get<Expert>(`/consultations/experts/${slug}/`);
  return data;
}

export interface BookingPayload {
  expert_id: string;
  mode: ConsultationMode;
  preferred_time: string;
  phone_number: string;
  concern: string;
  consent: boolean;
}

export async function bookConsultation(payload: BookingPayload) {
  const { data } = await api.post<Consultation>('/consultations/bookings/', payload);
  return data;
}

export async function fetchConsultations() {
  const { data } = await api.get<Paginated<Consultation> | Consultation[]>('/consultations/bookings/');
  return Array.isArray(data) ? data : data.results;
}

export async function fetchConsultation(reference: string) {
  const { data } = await api.get<Consultation>(`/consultations/bookings/${reference}/`);
  return data;
}
