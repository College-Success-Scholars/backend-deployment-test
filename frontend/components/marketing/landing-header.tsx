import Link from "next/link";
import { cn } from "@/lib/utils";

export function LandingHeader({ className }: { className?: string }) {
  return (
    <header className={cn(className)}>
      <Link
        href="/"
        className="inline-block text-3xl font-semibold tracking-tight text-foreground"
      >
        CSS Atlas
      </Link>
    </header>
  );
}
