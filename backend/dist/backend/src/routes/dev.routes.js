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
//# sourceMappingURL=dev.routes.js.map