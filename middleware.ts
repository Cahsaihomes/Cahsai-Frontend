import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/create-profile",
  "/forgot-password",
  "/new-password",
  "/onboarding",
  "/otp",
  "/password-updated",
  "/setup-payment",
  "/success",
  "/welcome",
  "/watch-homes",
  "/landing-page",
];

// const AGENT_PROFILE_ROUTES = ["/create-profile", "/setup-payment"];

// Map roles to dashboard paths
const DASHBOARD_PATHS: Record<string, string> = {
  buyer: "/buyerdashboard/home-screen",
  agent: "/agentdashboard/home",
  creator: "/creatordashboard/home",
  admin: "/admin/dashboard",
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Read cookies
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // -------------------------
  // 1️⃣ Public routes
  // -------------------------
  // if (PUBLIC_ROUTES.includes(pathname)) {
  //   // Redirect logged-in users away from login/signup
  //   if ((pathname === "/login" || pathname === "/signup") && token && role) {
  //     const dashboard = DASHBOARD_PATHS[role];
  //     if (dashboard) {
  //       url.pathname = dashboard;
  //       return NextResponse.redirect(url);
  //     }
  //   }
  //   return NextResponse.next();
  // }
  // if (PUBLIC_ROUTES.includes(pathname)) {
  //   if (pathname === "/login" && token && role) {
  //     const dashboard = DASHBOARD_PATHS[role];
  //     if (dashboard) {
  //       url.pathname = dashboard;
  //       return NextResponse.redirect(url);
  //     }
  //   }

  //   return NextResponse.next();
  // }

  // -------------------------
  // 2️⃣ Protect private routes
  // -------------------------
  // Buyer
  if (pathname.startsWith("/buyerdashboard") && (!token || role !== "buyer")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Agent
  if (pathname.startsWith("/agentdashboard") && (!token || role !== "agent")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Creator
  if (
    pathname.startsWith("/creatordashboard") &&
    (!token || role !== "creator")
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Admin
  if (pathname.startsWith("/admin") && (!token || role !== "admin")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // -------------------------
  // 3️⃣ Allow all other routes
  // -------------------------
  return NextResponse.next();
}

// Apply middleware only to relevant routes
export const config = {
  matcher: [
    "/buyerdashboard/:path*",
    "/agentdashboard/:path*",
    "/creatordashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/create-profile",
    "/forgot-password",
    "/new-password",
    "/onboarding",
    "/otp",
    "/password-updated",
    "/setup-payment",
    "/success",
    "/welcome",
    "/watch-homes",
    "/landing-page",
  ],
};
