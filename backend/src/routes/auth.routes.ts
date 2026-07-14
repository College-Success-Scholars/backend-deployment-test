/**
 * @file auth.routes.ts
 * @module backend/routes
 *
 * Express Router for /api/auth/* endpoints.
 * All routes require a valid JWT (requireAuth).
 *
 * Routes:
 *   GET /api/auth/me            → getMe
 *   GET /api/auth/profile       → getProfile
 *   POST /api/auth/profile      → createProfile
 *   GET /api/auth/mentees       → getMentees
 *   GET /api/auth/semester      → getActiveSemester (use sparingly; prefer shared campus calendar)
 *   GET /api/auth/active-semester → getActiveSemester (alias of /semester)
 *
 * ## What belongs here
 * - Route declarations for auth endpoints
 * - Auth middleware attachment
 *
 * ## What does NOT belong here
 * - Business logic (that's controllers/auth.controller.ts)
 */
import { Router } from "express";
import {
  requireAuth,
  requireTeamLeaderOrAbove,
  getMe,
  getProfile,
  createProfile,
  getMentees,
  getActiveSemester,
} from "../controllers/auth.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/me", getMe);
router.get("/profile", getProfile);
router.post("/profile", createProfile);
router.get("/mentees", getMentees);
router.get("/semester", getActiveSemester);
router.get("/active-semester", getActiveSemester);

export default router;
