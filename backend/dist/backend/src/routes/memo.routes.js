import { Router } from "express";
import { requireAuth, requireTeamLeaderOrAbove } from "../controllers/auth.controller.js";
import * as memoController from "../controllers/memo.controller.js";
const router = Router();
// Weekly memo data — any authenticated user
router.get("/weekly", requireAuth, memoController.weeklyMemo);
router.post("/refresh-stats", requireAuth, memoController.refreshStats);
// Full memo page data (all the processing in one call)
router.get("/page-data", requireAuth, memoController.pageData);
// These require team leader or above
router.post("/sync", requireTeamLeaderOrAbove, memoController.sync);
router.get("/traffic-count", requireTeamLeaderOrAbove, memoController.trafficCount);
export default router;
//# sourceMappingURL=memo.routes.js.map