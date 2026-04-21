import { Suspense } from "react";

export const metadata = {
  title: "Session Records Test | Dev Tools",
  description: "Test front_desk_records sync and read from lib/session-records",
};

export default function SessionRecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-5xl py-12">Loading…</div>}>
      {children}
    </Suspense>
  );
}
