import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value || "";
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

  // Store the original requested URL for post-login redirect
  const returnTo = request.nextUrl.pathname;

  // Handle unauthenticated users
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    // Only set returnTo if it's not an auth page
    if (!isAuthPage && returnTo !== "/login") {
      loginUrl.searchParams.set("returnTo", returnTo);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Handle authenticated users trying to access auth pages
  if (token && isAuthPage) {
    // Get the returnTo parameter from the URL
    const returnToPath = request.nextUrl.searchParams.get("returnTo");
    // Redirect to returnTo path if it exists, otherwise go to home
    const redirectUrl = new URL(returnToPath || "/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
