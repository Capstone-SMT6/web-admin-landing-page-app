import { NextRequest, NextResponse } from "next/server"

// Routes that require admin authentication
const PROTECTED = ["/dashboard"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))

  if (isProtected) {
    // We cannot read localStorage in middleware (server-side).
    // Instead we rely on a cookie set at login time.
    const token = req.cookies.get("admin_token")?.value
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
