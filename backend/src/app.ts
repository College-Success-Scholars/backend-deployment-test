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
import { requestLogger } from "./middleware/request-logger.js";

// CORS: accepts comma-separated origins via CORS_ORIGIN env var
// e.g. "https://app.vercel.app,https://app.railway.app"
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3002")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(requestLogger);

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

// Global error handler
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res
      .status(500)
      .json({
        error: err instanceof Error ? err.message : "Internal server error",
      });
  },
);

export { app };
