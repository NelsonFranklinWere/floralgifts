import type { Metadata } from "next";
import "./staff-theme.css";

export const metadata: Metadata = {
  title: "Staff Portal | Floral Whispers Gifts",
  robots: { index: false, follow: false },
};

export default function StaffRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="staff-app min-h-screen bg-white text-brand-gray-900 antialiased">
      {children}
    </div>
  );
}
