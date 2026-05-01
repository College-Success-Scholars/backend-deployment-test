import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function scholarNames(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function requiredHours(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function eligibleScholars(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function allUids(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function memoUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function teamLeaders(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function scholarUids(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getByUid(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map