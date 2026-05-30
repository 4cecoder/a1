import type { AppEnvironment, RuntimeConfig, RuntimeEnvironment } from "@/lib/types/system";

type RequiredKey =
  | "APP_NAME"
  | "APP_VERSION"
  | "NEXT_PUBLIC_APP_URL"
  | "NEXT_PUBLIC_CONVEX_URL";

const RUNTIME_ENVIRONMENTS = ["development", "test", "production"] as const;
const APP_ENVIRONMENTS = ["development", "test", "production", "preview"] as const;

function isValidUrl(value: string): boolean {
  try {
    void new URL(value);
    return true;
  } catch {
    return false;
  }
}

function assertRequired(key: RequiredKey, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }

  return value;
}

function parseRuntimeEnvironment(value: string | undefined): RuntimeEnvironment {
  if (value && (RUNTIME_ENVIRONMENTS as readonly string[]).includes(value)) {
    return value as RuntimeEnvironment;
  }

  return "development";
}

function parseAppEnvironment(value: string | undefined, fallback: RuntimeEnvironment): AppEnvironment {
  if (value && (APP_ENVIRONMENTS as readonly string[]).includes(value)) {
    return value as AppEnvironment;
  }

  if (value === "staging") {
    return "preview";
  }

  return fallback;
}

function parseAndValidateUrl(key: RequiredKey, value: string): string {
  if (!isValidUrl(value)) {
    throw new Error(`[env] ${key} must be a valid URL. Received: ${value}`);
  }

  return value;
}

export function getRuntimeConfig(): RuntimeConfig {
  const nodeEnv = parseRuntimeEnvironment(process.env.NODE_ENV);
  const appEnv = parseAppEnvironment(process.env.APP_ENV, nodeEnv);

  const required = {
    APP_NAME: assertRequired("APP_NAME", process.env.APP_NAME),
    APP_VERSION: assertRequired("APP_VERSION", process.env.APP_VERSION),
    NEXT_PUBLIC_APP_URL: assertRequired("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL),
    NEXT_PUBLIC_CONVEX_URL: assertRequired("NEXT_PUBLIC_CONVEX_URL", process.env.NEXT_PUBLIC_CONVEX_URL),
  };

  const appUrl = parseAndValidateUrl("NEXT_PUBLIC_APP_URL", required.NEXT_PUBLIC_APP_URL);
  const convexUrl = parseAndValidateUrl("NEXT_PUBLIC_CONVEX_URL", required.NEXT_PUBLIC_CONVEX_URL);

  if (nodeEnv === "production") {
    if (!appUrl.startsWith("https://")) {
      throw new Error("[env] NEXT_PUBLIC_APP_URL must use https in production");
    }

    if (!convexUrl.startsWith("https://")) {
      throw new Error("[env] NEXT_PUBLIC_CONVEX_URL must use https in production");
    }
  }

  return {
    nodeEnv,
    appEnv,
    appUrl,
    convexUrl,
    metadata: {
      name: required.APP_NAME,
      version: required.APP_VERSION,
    },
  };
}

