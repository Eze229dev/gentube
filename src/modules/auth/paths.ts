export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const DASHBOARD_PATH = "/dashboard";
export const AUTH_CALLBACK_PATH = "/auth/callback";

const AUTH_PAGES = new Set([LOGIN_PATH, SIGNUP_PATH]);

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.has(pathname);
}

export function isProtectedPath(pathname: string): boolean {
  return (
    pathname === DASHBOARD_PATH ||
    pathname.startsWith(`${DASHBOARD_PATH}/`) ||
    pathname.startsWith("/follow-ups") ||
    pathname.startsWith("/clients")
  );
}

export function isAuthCallback(pathname: string): boolean {
  return pathname === AUTH_CALLBACK_PATH;
}
