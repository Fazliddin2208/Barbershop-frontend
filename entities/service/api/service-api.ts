import { api } from "@/shared/api";
import type { Service, ServiceInput } from "../model/types";

export async function listServices(shopId: string) {
  const { data } = await api.get<Service[]>(`/shops/${shopId}/services`);
  return data;
}

export async function getService(shopId: string, serviceId: string) {
  const { data } = await api.get<Service>(`/shops/${shopId}/services/${serviceId}`);
  return data;
}

export async function createService(shopId: string, input: ServiceInput) {
  const { data } = await api.post<Service>(`/shops/${shopId}/services`, input);
  return data;
}

export async function addServiceImage(shopId: string, serviceId: string, file: File, isMain: boolean) {
  const body = new FormData();
  body.append("image", file);
  body.append("isMain", String(isMain));
  const { data } = await api.post<Service>(`/shops/${shopId}/services/${serviceId}/images`, body);
  return data;
}

export async function removeServiceImage(shopId: string, serviceId: string, imageId: string) {
  const { data } = await api.delete<Service>(`/shops/${shopId}/services/${serviceId}/images/${imageId}`);
  return data;
}
