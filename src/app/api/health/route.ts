import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SERVER_START_TIME = Date.now();

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "connected";
  let dbLatencyMs = 0;
  let isOperational = true;

  try {
    const probeStart = Date.now();
    const probe = prisma.$queryRaw`SELECT 1`;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), 1000)
    );
    await Promise.race([probe, timeout]);
    dbLatencyMs = Date.now() - probeStart;
  } catch (err) {
    dbStatus = "disconnected";
    dbLatencyMs = -1;
    isOperational = false;
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - SERVER_START_TIME) / 1000);

  const healthData = {
    status: isOperational ? "operational" : "degraded",
    version: "1.2.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    latencyMs: Date.now() - startTime,
    subsystems: {
      api: { status: "operational", latencyMs: Date.now() - startTime },
      database: { status: dbStatus, latencyMs: dbLatencyMs },
      scoringEngine: { status: "operational", algorithmVersion: "v1.2-deterministic" },
      automationsEngine: { status: "operational" },
    },
    systemMetrics: {
      memory: {
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      nodeVersion: process.version,
      platform: process.platform,
    },
  };

  return NextResponse.json(healthData, {
    status: isOperational ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "x-signalflow-status": isOperational ? "operational" : "degraded",
    },
  });
}

