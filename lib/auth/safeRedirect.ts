/** After user login: never send to /admin via open redirect. */
export function safeUserLoginRedirect(next: string | null): string {
  if (!next?.startsWith("/") || next.startsWith("//")) return "/dashboard";
  if (next.startsWith("/admin")) return "/dashboard";
  const allowed =
    next === "/dashboard" ||
    next.startsWith("/dashboard/") ||
    next === "/account" ||
    next.startsWith("/account/") ||
    next === "/apply" ||
    next.startsWith("/apply/");
  return allowed ? next : "/dashboard";
}

export function safeAdminLoginRedirect(next: string | null): string {
  if (!next?.startsWith("/") || next.startsWith("//")) return "/admin";
  if (!next.startsWith("/admin")) return "/admin";
  return next;
}
