import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const cookie = request.cookies.get("authToken");
  if (!cookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
