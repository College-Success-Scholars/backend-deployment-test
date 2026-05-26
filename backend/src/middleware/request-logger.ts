import type { Request, Response, NextFunction } from "express";

/**
 * Logs each incoming API request with method, path, status, and duration.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const method = req.method;
  const route = req.originalUrl || req.url;

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(`[API] ${method} ${route} — ${res.statusCode} (${durationMs}ms)`);
  });

  next();
}
