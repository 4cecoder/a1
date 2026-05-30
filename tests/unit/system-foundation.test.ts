import { afterEach, beforeEach, describe, expect, test } from "bun:test";

type EnvSnapshot = Record<string, string | undefined>;
const env = process.env as Record<string, string | undefined>;

const REQUIRED_ENV_KEYS = [
  "APP_NAME",
  "APP_VERSION",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CONVEX_URL",
  "NODE_ENV",
  "APP_ENV",
] as const;

function snapshotEnv(): EnvSnapshot {
  return Object.fromEntries(REQUIRED_ENV_KEYS.map((key) => [key, env[key]]));
}

function restoreEnv(snapshot: EnvSnapshot): void {
  for (const key of REQUIRED_ENV_KEYS) {
    const value = snapshot[key];
    if (typeof value === "undefined") {
      delete env[key];
    } else {
      env[key] = value;
    }
  }
}

function setValidBaseEnv(overrides: Partial<Record<(typeof REQUIRED_ENV_KEYS)[number], string>> = {}): void {
  env.APP_NAME = "A1";
  env.APP_VERSION = "0.1.0-test";
  env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  env.NEXT_PUBLIC_CONVEX_URL = "http://localhost:3210";
  env.NODE_ENV = "test";
  delete env.APP_ENV;

  for (const [key, value] of Object.entries(overrides)) {
    env[key] = value;
  }
}

describe("system foundation: health and env", () => {
  let envBeforeEach: EnvSnapshot;

  beforeEach(() => {
    envBeforeEach = snapshotEnv();
    setValidBaseEnv();
  });

  afterEach(() => {
    restoreEnv(envBeforeEach);
  });

  test("health endpoint returns the expected contract", async () => {
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    expect(response.status).toBe(200);

    const payload = (await response.json()) as Record<string, unknown>;

    expect(payload.status).toBe("ok");
    expect(typeof payload.version).toBe("string");
    expect(payload.version).toBe("0.1.0-test");
    expect(payload.environment).toBe("test");
    expect(typeof payload.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(String(payload.timestamp)))).toBe(false);
  });

  test("env helper maps APP_ENV=staging to preview", async () => {
    env.APP_ENV = "staging";

    const { getRuntimeConfig } = await import("@/lib/config/env");
    const config = getRuntimeConfig();

    expect(config.nodeEnv).toBe("test");
    expect(config.appEnv).toBe("preview");
    expect(config.metadata.name).toBe("A1");
  });

  test("env helper enforces https in production", async () => {
    env.NODE_ENV = "production";
    env.APP_ENV = "production";
    env.NEXT_PUBLIC_APP_URL = "http://a1.example";
    env.NEXT_PUBLIC_CONVEX_URL = "https://convex.example";

    const { getRuntimeConfig } = await import("@/lib/config/env");

    expect(() => getRuntimeConfig()).toThrow("[env] NEXT_PUBLIC_APP_URL must use https in production");
  });
});
