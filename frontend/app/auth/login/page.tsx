import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="min-h-svh bg-background p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-[1400px] flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <section
          aria-label="Inspiration"
          className="relative isolate hidden shrink-0 overflow-hidden rounded-2xl lg:block lg:min-h-0 lg:w-[45%] lg:rounded-3xl"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/umd_trees_2.jpg"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* Black vignette overlay with radial gradient */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40"
            aria-hidden
          />
        </section>

        <section className="flex flex-1 flex-col justify-center px-2 py-6 md:px-10 lg:w-[55%] lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <LoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}
