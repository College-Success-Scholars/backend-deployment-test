import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="min-h-svh bg-background p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-[1400px] flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <section
          aria-label="Inspiration"
          className="relative isolate min-h-52 shrink-0 overflow-hidden rounded-2xl lg:min-h-0 lg:w-[45%] lg:rounded-3xl"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/umd_trees.png"
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
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'
              }}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40"
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-8">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] text-white/90 uppercase">
                CSS Atlas
              </p>
              <Separator className="max-w-16 bg-white/40" />
            </div>
            <div className="space-y-3">
              <h2
                className="text-balance text-3xl leading-tight tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-login-serif), serif" }}
              >
                Brotherhood for Life
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/90">
                Sign in to see engagement, upcoming events, and the CSS Directory.
              </p>
            </div>
          </div>
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
