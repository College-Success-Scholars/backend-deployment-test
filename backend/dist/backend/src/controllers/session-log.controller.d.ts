import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function fetchFrontDesk(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function fetchStudy(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function frontDeskCleaned(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function frontDeskInRoom(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function frontDeskCompleted(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function studyCleaned(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function studyInRoom(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function studyCompleted(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=session-log.controller.d.ts.map