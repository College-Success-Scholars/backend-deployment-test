import { describe, expect, it } from "vitest";
import {
  getPostAuthRedirectPath,
  isAal2,
  nextTotpFriendlyName,
} from "./mfa";

describe("getPostAuthRedirectPath", () => {
  it("sends users without a TOTP factor to complete-profile when profile is missing", () => {
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal1",
        nextLevel: "aal1",
        hasProfile: false,
      }),
    ).toBe("/auth/complete-profile");
  });

  it("sends users without a TOTP factor to enroll when profile exists", () => {
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal1",
        nextLevel: "aal1",
        hasProfile: true,
      }),
    ).toBe("/auth/mfa/enroll");
  });

  it("sends enrolled but unverified sessions to verify", () => {
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal1",
        nextLevel: "aal2",
        hasProfile: true,
      }),
    ).toBe("/auth/mfa/verify");
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal1",
        nextLevel: "aal2",
        hasProfile: false,
      }),
    ).toBe("/auth/mfa/verify");
  });

  it("sends AAL2 users to dashboard or complete-profile", () => {
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal2",
        nextLevel: "aal2",
        hasProfile: true,
      }),
    ).toBe("/dashboard");
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal2",
        nextLevel: "aal2",
        hasProfile: false,
      }),
    ).toBe("/auth/complete-profile");
  });

  it("honors preferredNext only when AAL2 and profile exist", () => {
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal2",
        nextLevel: "aal2",
        hasProfile: true,
        preferredNext: "/dashboard/settings",
      }),
    ).toBe("/dashboard/settings");
    expect(
      getPostAuthRedirectPath({
        currentLevel: "aal1",
        nextLevel: "aal1",
        hasProfile: true,
        preferredNext: "/dashboard/settings",
      }),
    ).toBe("/auth/mfa/enroll");
  });
});

describe("isAal2", () => {
  it("detects aal2", () => {
    expect(isAal2("aal2")).toBe(true);
    expect(isAal2("aal1")).toBe(false);
    expect(isAal2(null)).toBe(false);
  });
});

describe("nextTotpFriendlyName", () => {
  it("returns a unique Authenticator-prefixed name", () => {
    const a = nextTotpFriendlyName();
    const b = nextTotpFriendlyName();
    expect(a.startsWith("Authenticator ")).toBe(true);
    expect(b.startsWith("Authenticator ")).toBe(true);
    expect(a).not.toBe(b);
  });
});
