import { UpdatePasswordForm } from "@/components/update-password-form";
import { getSafeInternalPath } from "@/lib/auth/safe-next-path";

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTo = getSafeInternalPath(params.next ?? null);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm variant="invite" redirectTo={redirectTo} />
      </div>
    </div>
  );
}
