import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function forWeek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function byUid(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function byUidAndWeek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function attended(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=tutor-report-log.controller.d.ts.map