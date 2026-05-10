import "dotenv/config";
import express from "express";
import cors from "cors";
import devRoutes from "./routes/dev.routes.js";
import memoRoutes from "./routes/memo.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import sessionLogRoutes from "./routes/session-log.routes.js";
import sessionRecordRoutes from "./routes/session-record.routes.js";
import trafficRoutes from "./routes/traffic.routes.js";
import formLogRoutes from "./routes/form-log.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import tutorReportRoutes from "./routes/tutor-report-log.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3001;
const HOST = process.env.HOST ?? "0.0.0.0";

app.use(cors({ origin: "http://localhost:3002" }));
app.use(express.json());

// Request & response logger
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json.bind(res);

  res.json = (body: unknown) => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} — ${res.statusCode} (${duration}ms)`);
    console.log("Response:", JSON.stringify(body, null, 2));
    return originalJson(body);
  };

  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "CSS Atlas API" });
});

app.use("/api/dev", devRoutes);
app.use("/api/memo", memoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/session-logs", sessionLogRoutes);
app.use("/api/session-records", sessionRecordRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/form-logs", formLogRoutes);
app.use("/api/daily-activity", activityRoutes);
app.use("/api/tutor-reports", tutorReportRoutes);

// Global error handler — logs the full error to the console
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
});

app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
