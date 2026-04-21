import { Router } from "express";
import { requireAuth } from "../controllers/auth.controller.js";
import * as sessionRecordController from "../controllers/session-record.controller.js";

const router = Router();

router.use(requireAuth);

// Front desk records
router.get("/front-desk/by-uid/:uid", sessionRecordController.getFrontDeskByUid);
router.get("/front-desk/week/:weekNum/all", sessionRecordController.getFrontDeskForWeekAll);
router.get("/front-desk/week/:weekNum", sessionRecordController.getFrontDeskForWeek);
router.get("/front-desk/:uid/week/:weekNum", sessionRecordController.getFrontDeskSingle);
router.post("/front-desk/sync", sessionRecordController.syncFrontDesk);
router.post("/front-desk/sync-all", sessionRecordController.syncFrontDeskAll);
router.patch("/front-desk/excuse", sessionRecordController.excuseFrontDesk);

// Study session records
router.get("/study/by-uid/:uid", sessionRecordController.getStudyByUid);
router.get("/study/week/:weekNum/all", sessionRecordController.getStudyForWeekAll);
router.get("/study/week/:weekNum", sessionRecordController.getStudyForWeek);
router.get("/study/:uid/week/:weekNum", sessionRecordController.getStudySingle);
router.post("/study/sync", sessionRecordController.syncStudy);
router.post("/study/sync-all", sessionRecordController.syncStudyAll);
router.patch("/study/excuse", sessionRecordController.excuseStudy);

export default router;
