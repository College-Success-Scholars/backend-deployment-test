import type { Request, Response, NextFunction } from "express";

function getRequestUrl(req: Request): string {
  const host = req.get("host") ?? "localhost";
  const protocol = req.protocol || "http";
  return `${protocol}://${host}${req.originalUrl}`;
}

/**
 * Logs each incoming API request with method, full URL, status, and duration.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const method = req.method;
  const url = getRequestUrl(req);

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(`[API] ${method} ${url} — ${res.statusCode} (${durationMs}ms)`);
  });

  next();
}
