import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function sessionsForWeek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function entryCount(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function entryCounts(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=traffic.controller.d.ts.map