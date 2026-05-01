import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { getSupabasePublicKey } from "./public-key";

export async function updateSession(request: NextRequest) {
  // #region agent log
  fetch("http://127.0.0.1:7726/ingest/9109985c-ede2-4114-8abc-e19657570996",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"6c0075"},body:JSON.stringify({sessionId:"6c0075",runId:"pre-fix",hypothesisId:"H2",location:"lib/supabase/middleware.ts:updateSession:entry",message:"Proxy/session handler invoked",data:{pathname:request.nextUrl.pathname},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  // Next.js static assets must not hit auth redirects (browser would get HTML instead of CSS/JS/fonts).
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    // #region agent log
    fetch("http://127.0.0.1:7726/ingest/9109985c-ede2-4114-8abc-e19657570996",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"6c0075"},body:JSON.stringify({sessionId:"6c0075",runId:"pre-fix",hypothesisId:"H4",location:"lib/supabase/middleware.ts:asset-bypass",message:"Bypassing _next/favicon path",data:{pathname},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return supabaseResponse;
  }
  // Files from public/ (and next/image internal fetches) must bypass auth — otherwise the
  // optimizer receives a redirect/HTML and fails with "isn't a valid image ... received null".
  if (/\.(ico|png|jpg|jpeg|svg|gif|webp|avif|woff2?|ttf|eot)$/i.test(pathname)) {
    return supabaseResponse;
  }

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabaseKey = getSupabasePublicKey();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (
    pathname !== "/" &&
    !user &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/auth") &&
    pathname !== "/traffic" &&
    !pathname.startsWith("/traffic/")
  ) {
    // #region agent log
    fetch("http://127.0.0.1:7726/ingest/9109985c-ede2-4114-8abc-e19657570996",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"6c0075"},body:JSON.stringify({sessionId:"6c0075",runId:"pre-fix",hypothesisId:"H3",location:"lib/supabase/middleware.ts:auth-redirect",message:"Redirecting unauthenticated request",data:{pathname,redirectTo:"/auth/login"},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
