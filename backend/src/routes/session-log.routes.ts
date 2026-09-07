/**
 * @file session-log.routes.ts
 * @module backend/routes
 *
 * Express Router for /api/session-logs/* endpoints.
 * All routes require requireTeamLeaderOrAbove: these return raw, per-scholar
 * check-in/out logs with an optional (often absent) scholarUids filter, so
 * they must not be reachable by a plain authenticated scholar — see
 * session-log.service.ts's requireDateOrUidLimit for the accompanying
 * date-range bound. Covers raw log retrieval, cleaned/errored pairs, in-room
 * status, and completed sessions for both front-desk and study session types.
 *
 * ## What belongs here
 * - Route declarations for session log endpoints
 *
 * ## What does NOT belong here
 * - Business logic (that's controllers/session-log.controller.ts)
 */
import { Router } from "express";
import { requireTeamLeaderOrAbove } from "../middleware/auth.middleware.js";
import * as sessionLogController from "../controllers/session-log.controller.js";

const router = Router();

router.use(requireTeamLeaderOrAbove);

// Front desk
router.post("/front-desk", sessionLogController.fetchFrontDesk);
router.post("/front-desk/cleaned", sessionLogController.frontDeskCleaned);
router.post("/front-desk/in-room", sessionLogController.frontDeskInRoom);
router.post("/front-desk/completed", sessionLogController.frontDeskCompleted);

// Study session
router.post("/study", sessionLogController.fetchStudy);
router.post("/study/cleaned", sessionLogController.studyCleaned);
router.post("/study/in-room", sessionLogController.studyInRoom);
router.post("/study/completed", sessionLogController.studyCompleted);

export default router;
