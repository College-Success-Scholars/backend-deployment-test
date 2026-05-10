"use client";

import { createClient } from "@/lib/supabase/client";

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
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options?.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  });
  const json = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) {
    return {
      error: (json as { error?: string }).error ?? `Backend error: ${res.status}`,
      ok: false,
      status: res.status,
    };
  }
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
