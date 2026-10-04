import { NextResponse } from "next/server";

export interface ApiResponseMeta {
  requestId: string;
  timestamp: string;
  durationMs?: number;
  total?: number;
  page?: number;
  limit?: number;
}

export function apiSuccess<T>(data: T, meta?: Partial<ApiResponseMeta>, status = 200) {
  const fullMeta: ApiResponseMeta = {
    requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  return NextResponse.json(
    {
      success: true,
      data,
      meta: fullMeta,
    },
    {
      status,
      headers: {
        "x-request-id": fullMeta.requestId,
        "x-response-time": `${fullMeta.durationMs || 12}ms`,
      },
    }
  );
}

export function apiError(message: string, status = 400, code?: string, details?: any) {
  const requestId = `err_${Math.random().toString(36).substring(2, 10)}`;

  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: code || `ERR_${status}`,
        details: details || null,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    {
      status,
      headers: {
        "x-request-id": requestId,
      },
    }
  );
}
