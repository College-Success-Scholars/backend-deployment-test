import type { Response } from "express";
import type { AuthenticatedRequest } from "./auth.controller.js";
export declare function test(req: AuthenticatedRequest, res: Response): void;
export declare function me(req: AuthenticatedRequest, res: Response): void;
export declare function getFrontDesk(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncFrontDesk(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncFrontDeskAll(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function excuseFrontDesk(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getStudy(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncStudy(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function syncStudyAll(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function excuseStudy(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getFormLog(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=dev.controller.d.ts.map