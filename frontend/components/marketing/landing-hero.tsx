import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHero({ className }: { className?: string }) {
  return (
    <section
      aria-label="Introduction"
      className={cn(
        "relative isolate min-h-[min(88svh,720px)] w-full overflow-hidden rounded-3xl md:min-h-[640px]",
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/umd_mckeldin.webp"
          alt="McKeldin Library at the University of Maryland, College Park"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/45"
        />
      </div>

      <div className="relative z-10 flex min-h-[min(88svh,720px)] flex-col items-center justify-center gap-5 px-5 py-12 text-center text-white md:min-h-[640px] md:gap-7 md:px-8">
        <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Your engagement, one clear view
        </h1>
        <p className="max-w-xl text-pretty text-base text-white/90 md:text-lg">
          CSS Atlas brings your metrics, directory, and programs together in one
          dashboard — built for UMD.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button
            asChild
            className="h-11 rounded-full border-0 bg-white px-8 text-base font-medium text-foreground shadow-none hover:bg-white/90"
          >
            <Link href="/auth/login">
              Sign in
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
