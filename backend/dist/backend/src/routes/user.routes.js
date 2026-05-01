import { Router } from "express";
import { requireAuth } from "../controllers/auth.controller.js";
import * as userController from "../controllers/user.controller.js";
const router = Router();
router.use(requireAuth);
router.post("/scholar-names", userController.scholarNames);
router.post("/required-hours", userController.requiredHours);
router.post("/eligible-scholars", userController.eligibleScholars);
router.get("/all-uids", userController.allUids);
router.get("/memo-users", userController.memoUsers);
router.get("/team-leaders", userController.teamLeaders);
router.get("/scholar-uids", userController.scholarUids);
router.get("/:uid", userController.getByUid);
export default router;
//# sourceMappingURL=user.routes.js.map