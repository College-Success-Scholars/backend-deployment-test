import { Router } from "express";
import { requireAuth } from "../controllers/auth.controller.js";
import * as activityController from "../controllers/activity.controller.js";
const router = Router();
router.use(requireAuth);
router.get("/minutes", activityController.minutes);
export default router;
//# sourceMappingURL=activity.routes.js.map