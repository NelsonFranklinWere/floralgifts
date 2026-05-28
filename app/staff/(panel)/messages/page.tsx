"use client";

import { useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import { formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import { cn } from "@/lib/utils";
import { StaffInlineSpinner } from "@/components/staff/StaffInlineLoaders";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [waLogs, setWaLogs] = useState<{ order_id: string; phone: string; message: string; created_at: string }[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () =>
    staffFetch<{ messages: Message[]; whatsappLogs: typeof waLogs }>("/api/staff/messages")
      .then((d) => {
        setMessages(d.messages);
        setWaLogs(d.whatsappLogs);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string, status: string) => {
    await staffFetch("/api/staff/messages", { method: "PATCH", body: JSON.stringify({ id, status }) });
    load();
  };

  const sendReply = async () => {
    if (!selected) return;
    await staffFetch("/api/staff/messages", {
      method: "PATCH",
      body: JSON.stringify({ id: selected.id, reply, toEmail: selected.email }),
    });
    setReply("");
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Messages"
        description={loading ? "Loading messages…" : "Contact enquiries and WhatsApp logs."}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <StaffCard title="Contact enquiries">
          <div className="space-y-2 max-h-[500px] overflow-y-auto -mx-1 px-1">
            {loading && (
              <div className="py-8 flex justify-center">
                <StaffInlineSpinner label="Loading messages…" />
              </div>
            )}
            {messages.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border text-sm transition-colors",
                  selected?.id === m.id
                    ? "border-brand-green/40 bg-brand-green/10"
                    : "border-brand-gray-200 hover:border-brand-pink/30 hover:bg-brand-pink/5"
                )}
              >
                <div className="flex justify-between gap-2">
                  <strong className="text-slate-900">{m.name}</strong>
                  <span className={m.status === "unread" ? "staff-pill-warning" : "staff-pill-neutral"}>{m.status}</span>
                </div>
                <p className="text-slate-500 truncate">{m.subject}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDateTime(m.created_at)}</p>
              </button>
            ))}
            {!loading && messages.length === 0 && (
              <p className="text-sm text-slate-500 py-4">No messages yet.</p>
            )}
          </div>
        </StaffCard>

        <StaffCard title={selected ? selected.subject : "Select a message"}>
          {selected ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.message}</p>
              <p className="text-xs text-slate-500">
                {selected.email} · {selected.name}
              </p>
              <div className="flex gap-2">
                <button type="button" className="staff-btn-secondary text-xs" onClick={() => markRead(selected.id, "read")}>
                  Mark read
                </button>
                <button type="button" className="staff-btn-secondary text-xs" onClick={() => markRead(selected.id, "resolved")}>
                  Resolved
                </button>
              </div>
              <textarea
                placeholder="Reply via email..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                className="staff-input min-h-[100px] py-2"
              />
              <button type="button" onClick={sendReply} disabled={!reply.trim()} className="staff-btn-primary">
                Send reply
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select an enquiry to view and reply.</p>
          )}
        </StaffCard>
      </div>

      <StaffCard title="WhatsApp notification log">
        <div className="text-sm space-y-2 max-h-48 overflow-y-auto">
          {waLogs.length === 0 && <p className="text-slate-500">No WhatsApp logs yet.</p>}
          {waLogs.map((w, i) => (
            <div key={i} className="border-b border-slate-100 pb-2">
              <span className="font-mono text-xs text-slate-600">{w.order_id}</span> → {w.phone}
              <p className="text-slate-500 truncate">{w.message}</p>
            </div>
          ))}
        </div>
      </StaffCard>
    </div>
  );
}
