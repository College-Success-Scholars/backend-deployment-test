import { Suspense } from "react";

export const metadata = {
  title: "Session Records (retired) | Dev Tools",
  description: "Session-record sync is retired; use campus-week attendance boards",
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
