"use client";

import { createClient } from "@/lib/supabase/client";
import {
  buildBackendRequestUrl,
  logApiError,
  logApiRequest,
  logApiResponse,
} from "@/lib/api-log";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

async function getAccessToken(): Promise<string | null> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function backendFetch<T>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<{ data: T; ok: true } | { error: string; ok: false; status: number }> {
  const method = options?.method ?? "GET";
  const requestUrl = buildBackendRequestUrl(BACKEND_URL, path);
  const start = Date.now();
  logApiRequest("client", method, requestUrl);

  const token = await getAccessToken();
  const res = await fetch(requestUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options?.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  });
  const durationMs = Date.now() - start;
  const json = await res.json().catch(() => ({ error: res.statusText }));

  if (!res.ok) {
    const error =
      (json as { error?: string }).error ?? `Backend error: ${res.status}`;
    logApiError("client", method, requestUrl, res.status, error, durationMs);
    return {
      error,
      ok: false,
      status: res.status,
    };
  }

  logApiResponse("client", method, requestUrl, res.status, durationMs);
  // Unwrap { data: ... } wrapper
  const payload = json != null && typeof json === "object" && "data" in json ? json.data : json;
  return { data: payload as T, ok: true };
}

export async function backendGet<T>(path: string) {
  return backendFetch<T>(path);
}

export async function backendPost<T>(path: string, body: unknown) {
  return backendFetch<T>(path, { method: "POST", body });
}

export async function backendPatch<T>(path: string, body: unknown) {
  return backendFetch<T>(path, { method: "PATCH", body });
}
