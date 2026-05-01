import { Router } from "express";
import { requireAuth } from "../controllers/auth.controller.js";
import * as trafficController from "../controllers/traffic.controller.js";
const router = Router();
router.use(requireAuth);
router.get("/sessions/:weekNum", trafficController.sessionsForWeek);
router.get("/entry-count/:weekNum", trafficController.entryCount);
router.post("/entry-counts", trafficController.entryCounts);
export default router;
//# sourceMappingURL=traffic.routes.js.map