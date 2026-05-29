"use client";

import { useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import { formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";

export default function AuditPage() {
  const [logs, setLogs] = useState<{ staff_email: string; action: string; entity_type: string; created_at: string; ip_address: string }[]>([]);
  const [logins, setLogins] = useState<{ staff_email: string; ip_address: string; success: boolean; created_at: string }[]>([]);

  useEffect(() => {
    staffFetch<{ logs: typeof logs; logins: typeof logins }>("/api/staff/audit")
      .then((d) => {
        setLogs(d.logs);
        setLogins(d.logins);
      })
      .catch(() => {
        setLogs([]);
        setLogins([]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Activity"
        description="Staff actions and login history."
      />

      <StaffCard title="Staff actions" noPadding bodyClassName="p-0">
        <div className="staff-table-wrap border-0 rounded-none shadow-none">
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Staff</th>
                <th>Action</th>
                <th>Entity</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i}>
                  <td className="text-xs text-slate-500">{formatDateTime(l.created_at)}</td>
                  <td>{l.staff_email}</td>
                  <td>{l.action}</td>
                  <td>{l.entity_type || "—"}</td>
                  <td className="text-xs text-slate-500">{l.ip_address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaffCard>

      <StaffCard title="Login history" noPadding bodyClassName="p-0">
        <div className="staff-table-wrap border-0 rounded-none shadow-none">
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Email</th>
                <th>IP</th>
                <th>Success</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((l, i) => (
                <tr key={i}>
                  <td className="text-xs text-slate-500">{formatDateTime(l.created_at)}</td>
                  <td>{l.staff_email}</td>
                  <td className="text-xs text-slate-500">{l.ip_address}</td>
                  <td>
                    {l.success ? (
                      <span className="staff-pill-success">Yes</span>
                    ) : (
                      <span className="staff-pill-danger">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaffCard>
    </div>
  );
}
