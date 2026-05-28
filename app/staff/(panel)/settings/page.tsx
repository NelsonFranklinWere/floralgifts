"use client";

import { useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffRole } from "@/lib/staff-auth";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import { StaffInlineSpinner } from "@/components/staff/StaffInlineLoaders";

export default function SettingsPage() {
  const [role, setRole] = useState<StaffRole>("staff");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [staff, setStaff] = useState<{ id: string; email: string; name: string; role: string; is_active: boolean }[]>([]);
  const [newStaff, setNewStaff] = useState({ email: "", password: "", name: "", role: "staff" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffFetch<{ role: StaffRole }>("/api/staff/me").then((u) => setRole(u.role));
    staffFetch<{ settings: Record<string, string>; staff: typeof staff }>("/api/staff/settings")
      .then((d) => {
        setSettings(d.settings);
        setStaff(d.staff);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    await staffFetch("/api/staff/settings", {
      method: "PATCH",
      body: JSON.stringify({ settings }),
    });
    alert("Settings saved");
  };

  const addStaff = async () => {
    await staffFetch("/api/staff/settings", {
      method: "POST",
      body: JSON.stringify({ type: "staff_user", ...newStaff }),
    });
    setNewStaff({ email: "", password: "", name: "", role: "staff" });
    const d = await staffFetch<{ staff: typeof staff }>("/api/staff/settings");
    setStaff(d.staff);
  };

  const isSuper = role === "super_admin";

  return (
    <div className="space-y-6 max-w-3xl">
      <StaffPageHeader
        title="Settings"
        description={loading ? "Loading settings…" : "Store details, payments, and staff accounts."}
      />

      {loading && (
        <div className="flex justify-center py-8">
          <StaffInlineSpinner label="Loading settings…" />
        </div>
      )}

      {!loading && (
      <>
      <StaffCard title="Store information">
        <div className="space-y-3">
          {[
            { key: "store_name", label: "Store name" },
            { key: "store_address", label: "Address" },
            { key: "store_phone", label: "Phone" },
            { key: "store_email", label: "Email" },
            { key: "whatsapp_number", label: "WhatsApp" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                className="staff-input"
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                disabled={!isSuper}
              />
            </div>
          ))}
          {isSuper && (
            <button type="button" onClick={saveSettings} className="staff-btn-primary mt-2">
              Save store settings
            </button>
          )}
        </div>
      </StaffCard>

      <StaffCard title="Payment settings">
        <div className="space-y-3">
          {[
            { key: "mpesa_paybill", label: "M-PESA Paybill" },
            { key: "mpesa_till", label: "Till number" },
            { key: "mpesa_account", label: "Paybill account" },
            { key: "tax_rate", label: "VAT rate (e.g. 0.16)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                className="staff-input"
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                disabled={!isSuper}
              />
            </div>
          ))}
          {isSuper && (
            <button type="button" onClick={saveSettings} className="staff-btn-primary mt-2">
              Save payment settings
            </button>
          )}
        </div>
      </StaffCard>

      {isSuper && (
        <StaffCard title="Staff accounts">
          <div className="space-y-4">
            {staff.map((s) => (
              <div key={s.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-900">{s.name || s.email}</span>
                <span className="staff-pill-neutral">
                  {s.role === "super_admin" || s.role === "admin" ? "Admin" : "Staff"}
                </span>
              </div>
            ))}
            <div className="grid gap-2 pt-2 border-t border-slate-100">
              <input className="staff-input" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
              <input className="staff-input" placeholder="Email" type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
              <input className="staff-input" placeholder="Password" type="password" value={newStaff.password} onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} />
              <select className="staff-select" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}>
                <option value="staff">Staff (limited)</option>
                <option value="super_admin">Admin (full access)</option>
              </select>
              <button type="button" onClick={addStaff} className="staff-btn-primary w-fit">
                Add staff user
              </button>
            </div>
          </div>
        </StaffCard>
      )}
      </>
      )}
    </div>
  );
}
