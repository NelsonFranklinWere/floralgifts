import { redirect } from "next/navigation";
import StaffShell from "@/components/staff/StaffShell";
import { StaffAuthProvider } from "@/lib/staff-session";
import { getStaffSessionFromCookies } from "@/lib/staff-server";
import "../staff-theme.css";

export default async function StaffPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getStaffSessionFromCookies();
  if (!user) {
    redirect("/staff/login?expired=1");
  }

  return (
    <StaffAuthProvider initialUser={user}>
      <StaffShell>{children}</StaffShell>
    </StaffAuthProvider>
  );
}
