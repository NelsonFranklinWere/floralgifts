"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import { formatCurrency } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import StaffLoading from "@/components/staff/StaffLoading";
import { useStaffRealtimeRefresh } from "@/components/staff/StaffRealtimeProvider";

export default function DeliveryPage() {
  const [data, setData] = useState<{
    deliveries: { id: string; customer_name: string; delivery_address: string; order_status?: string }[];
    zones: { id: string; name: string; fee: number }[];
    personnel: { id: string; name: string; phone: string }[];
  } | null>(null);
  const [zoneName, setZoneName] = useState("");
  const [zoneFee, setZoneFee] = useState(500);
  const [personName, setPersonName] = useState("");
  const [personPhone, setPersonPhone] = useState("");

  const load = () => staffFetch<NonNullable<typeof data>>("/api/staff/delivery").then(setData);

  useEffect(() => {
    load();
  }, []);

  useStaffRealtimeRefresh(load, [], ["order_new", "order_updated", "sync"]);

  const addZone = async () => {
    await staffFetch("/api/staff/delivery", { method: "POST", body: JSON.stringify({ type: "zone", name: zoneName, fee: zoneFee }) });
    setZoneName("");
    load();
  };

  const addPerson = async () => {
    await staffFetch("/api/staff/delivery", { method: "POST", body: JSON.stringify({ type: "personnel", name: personName, phone: personPhone }) });
    setPersonName("");
    setPersonPhone("");
    load();
  };

  if (!data) return <StaffLoading label="Loading delivery..." />;

  return (
    <div className="space-y-6">
      <StaffPageHeader title="Delivery" description="Pending orders, Nairobi zones, and drivers." />

      <StaffCard title="Pending deliveries">
        <div className="space-y-2">
          {data.deliveries.length === 0 && <p className="text-sm text-slate-500">No pending deliveries</p>}
          {data.deliveries.map((d) => (
            <div key={d.id} className="flex justify-between items-center border-b border-slate-100 pb-2 text-sm last:border-0">
              <div>
                <p className="font-medium text-slate-900">{d.customer_name}</p>
                <p className="text-slate-500 truncate max-w-md">{d.delivery_address}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="staff-pill-warning capitalize">{d.order_status || "pending"}</span>
                <Link href={`/staff/orders/${d.id}`} className="staff-link text-xs">
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </StaffCard>

      <div className="grid md:grid-cols-2 gap-6">
        <StaffCard title="Delivery zones (Nairobi)">
          <div className="space-y-3">
            {data.zones.map((z) => (
              <div key={z.id} className="flex justify-between text-sm">
                <span>{z.name}</span>
                <span className="font-medium tabular-nums">{formatCurrency(z.fee)}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <input className="staff-input flex-1 min-w-[120px]" placeholder="Area name" value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
              <input type="number" className="staff-input w-24" value={zoneFee} onChange={(e) => setZoneFee(Number(e.target.value))} />
              <button type="button" className="staff-btn-primary" onClick={addZone}>
                Add
              </button>
            </div>
          </div>
        </StaffCard>

        <StaffCard title="Delivery personnel">
          <div className="space-y-3">
            {data.personnel.map((p) => (
              <div key={p.id} className="text-sm">
                <strong className="text-slate-900">{p.name}</strong>
                <span className="text-slate-500"> — {p.phone}</span>
              </div>
            ))}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <input className="staff-input" placeholder="Name" value={personName} onChange={(e) => setPersonName(e.target.value)} />
              <input className="staff-input" placeholder="Phone" value={personPhone} onChange={(e) => setPersonPhone(e.target.value)} />
              <button type="button" className="staff-btn-primary" onClick={addPerson}>
                Add driver
              </button>
            </div>
          </div>
        </StaffCard>
      </div>
    </div>
  );
}
