/**
 * @file dev.routes.ts
 * @module backend/routes
 *
 * Express Router for /api/dev/* endpoints.
 * All routes require requireDeveloper (app_role === "developer").
 * Exposes diagnostic and operational endpoints not available to other roles.
 *
 * ## What belongs here
 * - Route declarations for developer-only endpoints
 *
 * ## What does NOT belong here
 * - Business logic (that's controllers/dev.controller.ts)
 * - Routes accessible to non-developer roles
 */
import { Router } from "express";
import { requireDeveloper } from "../controllers/auth.controller.js";
import * as devController from "../controllers/dev.controller.js";

const router = Router();

// All dev routes require developer access
router.use(requireDeveloper);

router.get("/test", devController.test);
router.get("/me", devController.me);

// Front desk records
router.get("/session-records/front-desk", devController.getFrontDesk);
router.post("/session-records/front-desk/sync", devController.syncFrontDesk);
router.post("/session-records/front-desk/sync-all", devController.syncFrontDeskAll);
router.patch("/session-records/front-desk/excuse", devController.excuseFrontDesk);

// Study session records
router.get("/session-records/study", devController.getStudy);
router.post("/session-records/study/sync", devController.syncStudy);
router.post("/session-records/study/sync-all", devController.syncStudyAll);
router.patch("/session-records/study/excuse", devController.excuseStudy);

// Form logs
router.get("/form-logs/:formType/:formId", devController.getFormLog);

export default router;
