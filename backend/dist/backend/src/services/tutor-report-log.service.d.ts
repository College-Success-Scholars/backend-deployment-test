import type { TutorReportLogRow } from "../models/tutor-report-log.model.js";
export declare function getTutorReportLogsForWeek(weekNum: number): Promise<TutorReportLogRow[]>;
export declare function getTutorReportLogsByUid(uid: string): Promise<TutorReportLogRow[]>;
export declare function getTutorReportLogsByUidAndWeek(uid: string, weekNum: number): Promise<TutorReportLogRow[]>;
export declare function didScholarAttendTutoring(uid: string, weekNum: number): Promise<boolean>;
//# sourceMappingURL=tutor-report-log.service.d.ts.map