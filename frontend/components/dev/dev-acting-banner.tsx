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
    <div className="bg-amber-50 border border-amber-200 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-100 flex flex-wrap items-center justify-between gap-2 rounded-md px-3 py-2 text-sm">
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
