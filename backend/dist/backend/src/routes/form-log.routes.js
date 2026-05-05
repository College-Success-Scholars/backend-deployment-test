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
// WHAF
router.get("/whaf/week/:weekNum", formLogController.whafForWeek);
router.get("/whaf/uid/:uid", formLogController.whafByUid);
router.get("/whaf/week/:weekNum/with-late", formLogController.whafForWeekWithLate);
// WPL
router.get("/wpl/week/:weekNum", formLogController.wplForWeek);
router.get("/wpl/uid/:uid", formLogController.wplByUid);
router.get("/wpl/uid/:uid/week/:weekNum", formLogController.wplByUidAndWeek);
router.get("/wpl/week/:weekNum/with-late", formLogController.wplForWeekWithLate);
router.get("/wpl/uid/:uid/with-late", formLogController.wplByUidWithLate);
router.get("/wpl/uid/:uid/week/:weekNum/with-late", formLogController.wplByUidAndWeekWithLate);
// Batch by UIDs
router.post("/whaf/by-uids", formLogController.whafByUids);
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
//# sourceMappingURL=form-log.routes.js.map