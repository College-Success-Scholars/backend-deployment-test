"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DevTestClient } from "@/app/dev/dev-test-client";

type DevMeResponse = {
  user: { id: string; email: string | null };
  profile: { app_role: string | null; email: string | null } | null;
};

export default function DevPage() {
  const [user, setUser] = useState<DevMeResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dev/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<DevMeResponse>;
      })
      .then((data) => {
        if (data) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-12">
      <div>
        <h1 className="text-2xl font-bold">Dev Tools</h1>
        <p className="text-muted-foreground mt-1">
          Test server functions on the client. Only visible to developers.
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          {loading
            ? "Loading…"
            : `Logged in as: ${user?.email ?? "No user found"}`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/dev/session-logs"
          className="text-primary hover:underline text-sm font-medium"
        >
          Session Logs Test →
        </Link>
        <Link
          href="/dev/session-records"
          className="text-primary hover:underline text-sm font-medium"
        >
          Session Records Test →
        </Link>
        <Link
          href="/dev/traffic"
          className="text-primary hover:underline text-sm font-medium"
        >
          Traffic →
        </Link>
        <Link
          href="/dev/time"
          className="text-primary hover:underline text-sm font-medium"
        >
          Campus Time Test →
        </Link>
        <Link
          href="/dev/form-logs"
          className="text-primary hover:underline text-sm font-medium"
        >
          Form Logs Test →
        </Link>
        <Link
          href="/dev/profiles"
          className="text-primary hover:underline text-sm font-medium"
        >
          Profile Test →
        </Link>
      </div>

      <DevTestClient />
    </div>
  );
}
