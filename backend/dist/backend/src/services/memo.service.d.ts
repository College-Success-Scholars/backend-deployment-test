export declare function syncMemo(weekNum: number, mode: "light" | "heavy"): Promise<{
    mode: string;
    fd: {
        upserted: number;
    };
    ss: {
        upserted: number;
    };
    message: string;
}>;
//# sourceMappingURL=memo.service.d.ts.map