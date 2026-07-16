import { IdleResetProvider } from "@/components/layout/idle-reset-provider";

/**
 * Public kiosk layout for `/traffic`.
 * No auth or role gate — anyone (signed in or not) can record foot traffic.
 * Session middleware already treats `/traffic` as a public path.
 *
 * @see docs/dev/frontend/app/traffic/README.md — do not reintroduce gating
 */
export default function TrafficLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <IdleResetProvider>{children}</IdleResetProvider>;
}
