export type RuntimeEnvironment = "development" | "test" | "production";

export type AppEnvironment = RuntimeEnvironment | "preview";

export interface AppMetadata {
  name: string;
  version: string;
}

export interface RuntimeConfig {
  nodeEnv: RuntimeEnvironment;
  appEnv: AppEnvironment;
  appUrl: string;
  convexUrl: string;
  metadata: AppMetadata;
}

export interface HealthResponse {
  status: "ok";
  timestamp: string;
  version: string;
  environment: AppEnvironment;
}

export interface LogContext {
  requestId?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

export interface StructuredLogEntry {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  timestamp: string;
  environment: AppEnvironment;
  service: string;
  context?: LogContext;
  error?: {
    name?: string;
    message: string;
    stack?: string;
  };
}
