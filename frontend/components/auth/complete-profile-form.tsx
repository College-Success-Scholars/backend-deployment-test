"use client";

import { cn } from "@/lib/utils";
import { createScholarProfile } from "@/lib/server/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CompleteProfileForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cohort, setCohort] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cohortNum = Number.parseInt(cohort, 10);
    if (!Number.isFinite(cohortNum) || cohortNum < 1) {
      setError("Cohort must be a valid year (e.g. 2025)");
      setIsLoading(false);
      return;
    }

    const result = await createScholarProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      student_id: studentId.trim(),
      phone_number: phoneNumber.trim() || null,
      cohort: cohortNum,
    });

    if ("error" in result && result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.refresh();
    router.push("/auth/mfa/enroll");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete your profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to finish setting up your scholar account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  required
                  placeholder="Your scholar UID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cohort">Cohort</Label>
                <Input
                  id="cohort"
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 2025"
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Continue to authenticator setup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
