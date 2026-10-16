import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030",
});

const TOKEN_KEY = "barbershop_token";
const SHOP_KEY = "barbershop_shop_id";
const RENEWED_KEY = "barbershop_renewed_at";
const RENEW_AFTER_MS = 12 * 60 * 60 * 1000;

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getShopId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SHOP_KEY);
}

export function saveSession(token: string, shopId: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SHOP_KEY, shopId);
  localStorage.setItem(RENEWED_KEY, String(Date.now()));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SHOP_KEY);
  localStorage.removeItem(RENEWED_KEY);
}

let renewing: Promise<void> | null = null;

export function renewSession() {
  if (typeof window === "undefined") return Promise.resolve();
  const token = getToken();
  if (!token) return Promise.resolve();
  const renewedAt = Number(localStorage.getItem(RENEWED_KEY) || 0);
  if (Date.now() - renewedAt < RENEW_AFTER_MS) return Promise.resolve();
  if (renewing) return renewing;

  renewing = api
    .post("/auth/refresh")
    .then((response) => {
      saveSession(response.data.accessToken, getShopId() ?? "");
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearSession();
      }
    })
    .finally(() => {
      renewing = null;
    });
  return renewing;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!String(config.url ?? "").includes("/auth/refresh")) {
    void renewSession();
  }
  return config;
});

export function errorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong";
  }
  const payload = error.response?.data?.message;
  if (typeof payload === "string") return payload;
  if (payload && typeof payload === "object" && "message" in payload) {
    const inner = (payload as { message: unknown }).message;
    if (Array.isArray(inner)) return inner.join(", ");
    if (typeof inner === "string") return inner;
  }
  return "Something went wrong";
}
