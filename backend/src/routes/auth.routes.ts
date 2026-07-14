/**
 * @file auth.routes.ts
 * @module backend/routes
 *
 * Express Router for /api/auth/* endpoints.
 * All routes require a valid JWT (requireAuth).
 * GET /me and POST /profile allow AAL1 (onboarding / MFA routing).
 * Other routes require AAL2.
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
  requireAal2,
  getMe,
  getProfile,
  createProfile,
  getMentees,
  getActiveSemester,
} from "../controllers/auth.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/me", getMe);
router.post("/profile", createProfile);

router.use(requireAal2);

router.get("/profile", getProfile);
router.get("/mentees", getMentees);
router.get("/semester", getActiveSemester);
router.get("/active-semester", getActiveSemester);

export default router;
