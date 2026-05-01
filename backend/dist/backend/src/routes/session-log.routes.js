import { Router } from "express";
import { requireAuth } from "../controllers/auth.controller.js";
import * as sessionLogController from "../controllers/session-log.controller.js";
const router = Router();
router.use(requireAuth);
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
//# sourceMappingURL=session-log.routes.js.map