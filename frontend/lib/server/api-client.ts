import "server-only";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";
const BASE64_PREFIX = "base64-";

function getSupabaseProjectRef(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    const ref = hostname.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

function getCookieChunkIndex(name: string): number {
  const match = name.match(/\.([0-9]+)$/);
  if (!match) return 0;
  return Number.parseInt(match[1], 10);
}

/**
 * Decode a base64url string (no padding) to a UTF-8 string.
 */
function base64UrlDecode(str: string): string {
  // Convert base64url to standard base64
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding
  while (b64.length % 4 !== 0) b64 += "=";
  return Buffer.from(b64, "base64").toString("utf-8");
}

/**
 * Extract the Supabase access token from auth cookies.
 * @supabase/ssr v0.7 stores cookies as "base64-<base64url(json)>",
 * possibly chunked across sb-<ref>-auth-token.0, .1, etc.
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const projectRef = getSupabaseProjectRef();

    // Find Supabase auth token cookies.
    const authCandidates = allCookies
      .filter((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Select only one cookie family to avoid combining multiple Supabase projects.
    const preferredBase = projectRef ? `sb-${projectRef}-auth-token` : null;
    let authParts = authCandidates;
    if (preferredBase) {
      const matching = authCandidates.filter(
        (c) => c.name === preferredBase || c.name.startsWith(`${preferredBase}.`)
      );
      if (matching.length > 0) {
        authParts = matching;
      }
    }
    authParts = authParts.sort((a, b) => getCookieChunkIndex(a.name) - getCookieChunkIndex(b.name));

    if (authParts.length === 0) return null;

    const raw = authParts.map((c) => c.value).join("");

    // Decode: strip "base64-" prefix, then base64url-decode
    let decoded: string;
    if (raw.startsWith(BASE64_PREFIX)) {
      decoded = base64UrlDecode(raw.substring(BASE64_PREFIX.length));
    } else {
      decoded = raw;
    }

    const session = JSON.parse(decoded);
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function backendFetch<T>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const token = await getAccessToken();
  const requestUrl = `${BACKEND_URL}${path}`;
  const res = await fetch(requestUrl, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options?.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error(BACKEND_URL + " " + path + " " + (err as { error?: string }).error);
    throw new Error((err as { error?: string }).error ?? `Backend error: ${res.status}`);
  }
  const json = await res.json();
  // Backend wraps responses in { data: ... } — unwrap automatically
  if (json != null && typeof json === "object" && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

export async function backendGet<T>(path: string): Promise<T> {
  return backendFetch<T>(path);
}

export async function backendPost<T>(path: string, body: unknown): Promise<T> {
  return backendFetch<T>(path, { method: "POST", body });
}

export async function backendPatch<T>(path: string, body: unknown): Promise<T> {
  return backendFetch<T>(path, { method: "PATCH", body });
}
