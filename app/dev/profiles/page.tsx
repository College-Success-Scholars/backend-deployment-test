import Link from "next/link";
import { fetchAllUsersForMemo } from "@/lib/server/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfilesUserTable } from "./profiles-user-table";

export const metadata = {
  title: "Profile Test | Dev Tools",
  description: "Test profile functionality: list users and view per-user data",
};

export const dynamic = "force-dynamic";

export default async function DevProfilesPage() {
  const users = await fetchAllUsersForMemo();

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-12">
      <div>
        <Link
          href="/dev"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          ← Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Profile Test</h1>
        <p className="text-muted-foreground mt-1">
          All users. Click a name to open their profile (records, tickets, forms).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            {users.length} user{users.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfilesUserTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
