import { describe, expect, it } from "vitest";
import { getJwtAal } from "../controllers/auth.controller.js";

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString(
    "base64url",
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.sig`;
}

describe("getJwtAal", () => {
  it("reads aal from JWT payload", () => {
    expect(getJwtAal(makeJwt({ aal: "aal2", sub: "u1" }))).toBe("aal2");
    expect(getJwtAal(makeJwt({ aal: "aal1" }))).toBe("aal1");
  });

  it("returns null for missing or invalid tokens", () => {
    expect(getJwtAal(null)).toBeNull();
    expect(getJwtAal("not-a-jwt")).toBeNull();
    expect(getJwtAal(makeJwt({ sub: "u1" }))).toBeNull();
  });
});
