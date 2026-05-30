import { NextResponse } from "next/server";

import { getRuntimeConfig } from "@/lib/config/env";
import type { HealthResponse } from "@/lib/types/system";

export async function GET() {
  const runtimeConfig = getRuntimeConfig();

  const payload: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: runtimeConfig.metadata.version,
    environment: runtimeConfig.appEnv,
  };

  return NextResponse.json(payload, { status: 200 });
}
