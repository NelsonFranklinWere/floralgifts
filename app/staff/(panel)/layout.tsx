import StaffShell from "@/components/staff/StaffShell";
import "../staff-theme.css";

export default function StaffPanelLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>;
}
