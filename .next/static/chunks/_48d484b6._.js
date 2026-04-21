(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase/public-key.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resolves the public Supabase API key from env. Supports publishable keys,
 * the default publishable key, and the legacy anon key name from dashboard snippets.
 */ __turbopack_context__.s([
    "getSupabasePublicKey",
    ()=>getSupabasePublicKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function getSupabasePublicKey() {
    var _process_env_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY, _ref, _ref1;
    return (_ref1 = (_ref = (_process_env_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY) !== null && _process_env_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY !== void 0 ? _process_env_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) !== null && _ref !== void 0 ? _ref : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY) !== null && _ref1 !== void 0 ? _ref1 : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$public$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/public-key.ts [app-client] (ecmascript)");
;
;
function createClient() {
    const supabaseKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$public$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabasePublicKey"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey, {
        auth: {
            flowType: "pkce"
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth/invite-from-hash-redirect.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InviteFromHashRedirect",
    ()=>InviteFromHashRedirect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function InviteFromHashRedirect() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const redirected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InviteFromHashRedirect.useEffect": ()=>{
            // Only run once on mount — no pathname dependency
            const hash = window.location.hash;
            if (!hash || hash.length <= 1) return;
            const params = new URLSearchParams(hash.slice(1));
            if (params.get("type") !== "invite") return;
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            const go = {
                "InviteFromHashRedirect.useEffect.go": ()=>{
                    if (redirected.current) return;
                    redirected.current = true;
                    router.replace("/auth/set-password");
                }
            }["InviteFromHashRedirect.useEffect.go"];
            // Listen FIRST before getSession, so we don't miss the event
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "InviteFromHashRedirect.useEffect": (event, session)=>{
                    if (session && (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "INITIAL_SESSION")) {
                        go();
                    }
                }
            }["InviteFromHashRedirect.useEffect"]);
            // Also try immediately in case session was already established
            supabase.auth.getSession().then({
                "InviteFromHashRedirect.useEffect": (param)=>{
                    let { data: { session } } = param;
                    if (session) go();
                }
            }["InviteFromHashRedirect.useEffect"]);
            return ({
                "InviteFromHashRedirect.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["InviteFromHashRedirect.useEffect"];
        }
    }["InviteFromHashRedirect.useEffect"], [
        router
    ]);
    return null;
}
_s(InviteFromHashRedirect, "pSQ7X0eR1/fw3qaFjx/r+e8ym8A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = InviteFromHashRedirect;
var _c;
__turbopack_context__.k.register(_c, "InviteFromHashRedirect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_48d484b6._.js.map