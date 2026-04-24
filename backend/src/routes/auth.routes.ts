import { Router } from "express";
import {
  requireAuth,
  requireTeamLeaderOrAbove,
  getMe,
  getProfile,
  getMentees,
  getActiveSemester,
} from "../controllers/auth.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/me", getMe);
router.get("/profile", getProfile);
router.get("/mentees", getMentees);
router.get("/semester", getActiveSemester);
router.get("/active-semester", getActiveSemester);

export default router;
