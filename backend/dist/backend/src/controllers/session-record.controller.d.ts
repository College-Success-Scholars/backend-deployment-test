import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function getFrontDeskByUid(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getStudyByUid(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getFrontDeskForWeek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getFrontDeskForWeekAll(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getStudyForWeek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getStudyForWeekAll(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getFrontDeskSingle(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getStudySingle(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncFrontDesk(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncFrontDeskAll(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncStudy(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncStudyAll(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function excuseFrontDesk(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function excuseStudy(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=session-record.controller.d.ts.map