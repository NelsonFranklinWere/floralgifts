import { headers } from "next/headers";

export function isStaffPath(pathname: string): boolean {
  return pathname === "/staff" || pathname.startsWith("/staff/");
}

/** Pathname from middleware — same on server and client render. */
export async function getRequestPathname(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") ?? "";
}
