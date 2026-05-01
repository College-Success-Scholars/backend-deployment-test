import { syncFrontDeskRecordsForWeek, syncFrontDeskRecordsForWeekAllUids, syncStudySessionRecordsForWeek, syncStudySessionRecordsForWeekAllUids, } from "./session-record.service.js";
export async function syncMemo(weekNum, mode) {
    if (mode === "light") {
        const [fdResult, ssResult] = await Promise.all([
            syncFrontDeskRecordsForWeek(weekNum),
            syncStudySessionRecordsForWeek(weekNum),
        ]);
        return {
            mode: "light",
            fd: fdResult,
            ss: ssResult,
            message: `FD: ${fdResult.upserted} record(s), SS: ${ssResult.upserted} record(s) for week ${weekNum}.`,
        };
    }
    const [fdResult, ssResult] = await Promise.all([
        syncFrontDeskRecordsForWeekAllUids(weekNum),
        syncStudySessionRecordsForWeekAllUids(weekNum),
    ]);
    return {
        mode: "heavy",
        fd: fdResult,
        ss: ssResult,
        message: `FD: ${fdResult.upserted} record(s), SS: ${ssResult.upserted} record(s) for all UIDs, week ${weekNum}.`,
    };
}
//# sourceMappingURL=memo.service.js.map