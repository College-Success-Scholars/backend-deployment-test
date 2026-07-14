"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setActiveTestProfile } from "@/lib/server/dev-profile-actions";

type DevActingBannerProps = {
  label: string;
};

export function DevActingBanner({ label }: DevActingBannerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchToMyProfile() {
    startTransition(async () => {
      await setActiveTestProfile(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-warning/40 bg-warning-muted px-3 py-2 text-sm text-warning-muted-foreground">
      <span>
        Viewing as: <strong>{label}</strong> (read-only)
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={switchToMyProfile}
      >
        Switch to My profile
      </Button>
    </div>
  );
}
