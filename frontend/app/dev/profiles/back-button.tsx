"use client";

import { useRouter } from "next/navigation";

export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-muted-foreground hover:text-foreground text-sm font-medium"
    >
      {children}
    </button>
  );
}
