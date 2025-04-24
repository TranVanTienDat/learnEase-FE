import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;

  //   if (currentUser && !request.nextUrl.pathname.startsWith("/dashboard")) {
  //     return Response.redirect(new URL("/dashboard", request.url));
  //   }

  const loggedPath = 'workspace';
  if (!sessionToken && request.nextUrl.pathname.includes(loggedPath)) {
    return Response.redirect(new URL("/", request.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
