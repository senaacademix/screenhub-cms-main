import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type Role = "admin" | "publisher";

/**
 * Centralized route protection rules.
 * Key: Path prefix
 * Value: Array of allowed roles
 */
export const routePermissions: Record<string, Role[]> = {
  "/admin": ["admin"],
  "/publisher": ["admin", "publisher"],
  "/monitoring": ["admin", "publisher"],
  "/screens": ["admin", "publisher"],
};

/**
 * PROXY (formerly Middleware)
 * Runs on every request defined in the matcher.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle root redirect for logged-in users
  if (pathname === "/") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (session) {
      const role = session.user.role;
      if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
      if (role === "publisher") return NextResponse.redirect(new URL("/publisher", request.url));
    }
  }

  // 2. Handle role-based protection
  const matchedPath = Object.keys(routePermissions).find((path) =>
    pathname.startsWith(path)
  );

  if (matchedPath) {
    const allowedRoles = routePermissions[matchedPath];
    
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const userRole = session.user.role as any;

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * UTILITIES for Pages and Actions
 */

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

export async function protectRoute(allowedRoles: Role[]) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const userRole = session.user.role as Role;

  if (!allowedRoles.includes(userRole)) {
    redirect("/");
  }

  return session;
}

export async function isAdmin() {
  const session = await getSession();
  return session?.user.role === "admin";
}

export async function isPublisher() {
  const session = await getSession();
  return session?.user.role === "publisher";
}



export const config = {
  matcher: [
    "/",
    "/admin/:path*", 
    "/publisher/:path*",
    "/monitoring/:path*",
    "/screens/:path*"
  ],
};
