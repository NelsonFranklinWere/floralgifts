"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import { formatCurrency } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import { Search, Download } from "lucide-react";

interface Customer {
  email: string;
  name: string;
  phone: string;
  orders: number;
  spend: number;
  joined: string;
  blocked: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    staffFetch<Customer[]>(`/api/staff/customers${params}`).then(setCustomers);
  }, [q]);

  const exportCsv = () => {
    const header = "Name,Email,Phone,Orders,Spend (cents),Joined\n";
    const rows = customers.map((c) =>
      `"${c.name}","${c.email}","${c.phone}",${c.orders},${c.spend},"${c.joined}"`
    );
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Customers"
        description="Search shoppers and view order history."
        actions={
          <button type="button" onClick={exportCsv} className="staff-btn-secondary">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <StaffCard>
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search name, email, phone..."
            className="staff-input pl-10"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="staff-table-wrap border-0 shadow-none">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total spend</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email || c.phone}>
                  <td className="font-medium">
                    {c.name}
                    {c.blocked && <span className="staff-pill-danger ml-2">Blocked</span>}
                  </td>
                  <td>{c.email || "—"}</td>
                  <td>{c.phone}</td>
                  <td>{c.orders}</td>
                  <td className="tabular-nums">{formatCurrency(c.spend)}</td>
                  <td>
                    <Link href={`/staff/customers/${encodeURIComponent(c.email || c.phone)}`} className="staff-link text-sm">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <p className="text-center py-8 text-sm text-slate-500">No customers found.</p>
          )}
        </div>
      </StaffCard>
    </div>
  );
}
