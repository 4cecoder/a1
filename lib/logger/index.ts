import { getRuntimeConfig } from "@/lib/config/env";
import type { LogContext, StructuredLogEntry } from "@/lib/types/system";

function normalizeError(error: unknown): StructuredLogEntry["error"] | undefined {
  if (!error) return undefined;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

function emit(entry: StructuredLogEntry): void {
  const serialized = JSON.stringify(entry);

  if (entry.level === "error") {
    console.error(serialized);
    return;
  }

  if (entry.level === "warn") {
    console.warn(serialized);
    return;
  }

  if (entry.level === "debug") {
    console.debug(serialized);
    return;
  }

  console.info(serialized);
}

function buildEntry(
  level: StructuredLogEntry["level"],
  message: string,
  context?: LogContext,
  error?: unknown,
): StructuredLogEntry {
  const config = getRuntimeConfig();

  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    environment: config.appEnv,
    service: config.metadata.name,
    context,
    error: normalizeError(error),
  };
}

export function createLogger(baseContext: LogContext = {}) {
  return {
    debug(message: string, context?: LogContext) {
      emit(buildEntry("debug", message, { ...baseContext, ...context }));
    },
    info(message: string, context?: LogContext) {
      emit(buildEntry("info", message, { ...baseContext, ...context }));
    },
    warn(message: string, context?: LogContext) {
      emit(buildEntry("warn", message, { ...baseContext, ...context }));
    },
    error(message: string, error?: unknown, context?: LogContext) {
      emit(buildEntry("error", message, { ...baseContext, ...context }, error));
    },
    child(context: LogContext) {
      return createLogger({ ...baseContext, ...context });
    },
  };
}

export const logger = createLogger();
