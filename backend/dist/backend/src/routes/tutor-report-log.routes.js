import { Router } from "express";
import { requireTeamLeaderOrAbove } from "../controllers/auth.controller.js";
import * as tutorReportController from "../controllers/tutor-report-log.controller.js";
const router = Router();
router.use(requireTeamLeaderOrAbove);
router.get("/week/:weekNum", tutorReportController.forWeek);
router.get("/uid/:uid", tutorReportController.byUid);
router.get("/uid/:uid/week/:weekNum", tutorReportController.byUidAndWeek);
router.get("/attended/:uid/week/:weekNum", tutorReportController.attended);
export default router;
//# sourceMappingURL=tutor-report-log.routes.js.map