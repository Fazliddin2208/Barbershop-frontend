import { api } from "@/shared/api";
import type { Appointment, AppointmentInput, BarberOption, ServiceOption } from "../model/types";

export async function listAppointments(shopId: string) {
  const { data } = await api.get<Appointment[]>(`/shops/${shopId}/bookings`);
  return data;
}

export async function getAppointment(shopId: string, appointmentId: string) {
  const { data } = await api.get<Appointment>(`/shops/${shopId}/bookings/${appointmentId}`);
  return data;
}

export async function createAppointment(shopId: string, input: AppointmentInput) {
  const { data } = await api.post<Appointment>(`/shops/${shopId}/bookings`, input);
  return data;
}

export async function updateAppointmentStatus(shopId: string, appointmentId: string, status: string) {
  const { data } = await api.patch<Appointment>(`/shops/${shopId}/bookings/${appointmentId}`, { status });
  return data;
}

export async function listBarbers(shopId: string) {
  const { data } = await api.get<BarberOption[]>(`/shops/${shopId}/barbers`);
  return data;
}

export async function listServiceOptions(shopId: string) {
  const { data } = await api.get<ServiceOption[]>(`/shops/${shopId}/services`);
  return data;
}

export async function listDaySlots(shopId: string, barberId: string, date: string) {
  const { data } = await api.get<{ startTime: string; isBooked: boolean }[]>(`/shops/${shopId}/timeslots`, {
    params: { barberId, date },
  });
  return data;
}
