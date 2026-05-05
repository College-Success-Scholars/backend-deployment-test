import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function sync(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function weeklyMemo(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function refreshStats(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function pageData(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function trafficCount(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=memo.controller.d.ts.map