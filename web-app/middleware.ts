// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth", "/mission", "/team", "/privacy", "/pricing", "/faqs", "/infrastructure"];

const PRIVATE_PATHS = ["/dashboard", "/interview"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    const isPrivate = PRIVATE_PATHS.some((p) => pathname.startsWith(p));
    console.log("Middleware - Path:", pathname, "Token:", !!token);
    console.log("Is Public Path:", isPublic);

    if (!isPublic && !token) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    if (isPrivate && !token) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    if (pathname === "/auth" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
