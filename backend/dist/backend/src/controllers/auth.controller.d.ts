import type { Request, Response, NextFunction } from "express";
import type { ProfilesRow } from "../models/user.model.js";
export interface AuthenticatedRequest extends Request {
    authUser?: {
        id: string;
        email?: string;
    };
    profile?: ProfilesRow | null;
    /** Raw bearer token — available after auth middleware runs. */
    accessToken?: string;
}
export declare function requireDeveloper(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function requireTeamLeaderOrAbove(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Requires that the authenticated user is either:
 * 1. Accessing their own data (req.params.uid matches their student_id), or
 * 2. A team leader or above (can access any uid).
 *
 * Must be used AFTER requireAuth (needs req.profile to be populated).
 * The :uid route param is compared against profile.student_id.
 */
export declare function requireSelfOrTeamLeader(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export declare function getMe(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getMentees(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getActiveSemester(_req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map