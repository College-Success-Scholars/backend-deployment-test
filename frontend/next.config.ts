import type { NextConfig } from "next";

const turbopackRoot = process.cwd();
// #region agent log
fetch("http://127.0.0.1:7726/ingest/9109985c-ede2-4114-8abc-e19657570996",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"6c0075"},body:JSON.stringify({sessionId:"6c0075",runId:"pre-fix",hypothesisId:"H5",location:"next.config.ts:turbopack-root",message:"Computed Turbopack root",data:{cwd:process.cwd(),turbopackRoot},timestamp:Date.now()})}).catch(()=>{});
// #endregion

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
