/**
 * @file form-log.routes.ts
 * @module backend/routes
 *
 * Express Router for /api/form-logs/* endpoints.
 * Covers MCF, WHAF, and WPL form log queries (30+ endpoints).
 * Most routes require requireAuth; some team-leader stats routes
 * may require requireTeamLeaderOrAbove.
 *
 * ## What belongs here
 * - Route declarations for form log endpoints
 *
 * ## What does NOT belong here
 * - Business logic (that's controllers/form-log.controller.ts)
 */
import { Router } from "express";
import { requireAuth } from "../controllers/auth.controller.js";
import * as formLogController from "../controllers/form-log.controller.js";

const router = Router();

router.use(requireAuth);

// MCF
router.get("/mcf/week/:weekNum", formLogController.mcfForWeek);
router.get("/mcf/uid/:uid", formLogController.mcfByUid);
router.get("/mcf/uid/:uid/week/:weekNum", formLogController.mcfByUidAndWeek);
router.get("/mcf/week/:weekNum/with-late", formLogController.mcfForWeekWithLate);
router.get("/mcf/uid/:uid/with-late", formLogController.mcfByUidWithLate);
router.get("/mcf/uid/:uid/week/:weekNum/with-late", formLogController.mcfByUidAndWeekWithLate);

// WHAF (legacy path) + WAHF (canonical)
router.get("/whaf/week/:weekNum", formLogController.whafForWeek);
router.get("/wahf/week/:weekNum", formLogController.whafForWeek);
router.get("/whaf/uid/:uid", formLogController.whafByUid);
router.get("/wahf/uid/:uid", formLogController.whafByUid);
router.get("/whaf/week/:weekNum/with-late", formLogController.whafForWeekWithLate);
router.get("/wahf/week/:weekNum/with-late", formLogController.whafForWeekWithLate);

// WPL
router.get("/wpl/week/:weekNum", formLogController.wplForWeek);
router.get("/wpl/uid/:uid", formLogController.wplByUid);
router.get("/wpl/uid/:uid/week/:weekNum", formLogController.wplByUidAndWeek);
router.get("/wpl/week/:weekNum/with-late", formLogController.wplForWeekWithLate);
router.get("/wpl/uid/:uid/with-late", formLogController.wplByUidWithLate);
router.get("/wpl/uid/:uid/week/:weekNum/with-late", formLogController.wplByUidAndWeekWithLate);

// Batch by UIDs
router.post("/whaf/by-uids", formLogController.whafByUids);
router.post("/wahf/by-uids", formLogController.whafByUids);
router.post("/mcf/by-uids", formLogController.mcfByUids);
router.post("/wpl/by-uids", formLogController.wplByUids);
router.post("/tutor-reports/by-uids", formLogController.tutorReportsByUids);
router.post("/daily-activity/by-uids", formLogController.dailyActivityByUids);

// Recent submissions & team leader stats
router.post("/recent-submissions", formLogController.recentSubmissions);
router.post("/team-leader-stats", formLogController.teamLeaderStats);

// Generic form log by type/id (must be last to avoid catching other routes)
router.get("/:formType/:formId", formLogController.getFormLog);

export default router;
