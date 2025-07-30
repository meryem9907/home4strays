import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getSecret } from "../utils/secret-manager";

describe("Test Secrets", () => {
  const key = "HOME4STRAYS_TEST_ENV";
  const notKey = "KEY_THAT_DOES_NOT_EXISTS_HOME4STRAYS";
  const value = "home4strays";

  beforeEach(() => {
    process.env[key] = value;
  });

  it("should return the correct env", async () => {
    expect(getSecret(key)).toBe(value);
    expect(getSecret(notKey, value)).toBe(value);
    expect(getSecret(notKey)).toBe("");
  });

  afterEach(() => {
    delete process.env[key];
  });
});
