import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

const SQL = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
  END IF;
END $$;
`;

export async function POST(request: NextRequest) {
  try {
    requireSuperAdmin(request);
    const { error } = await supabaseAdmin.rpc("exec_sql", { sql: SQL });
    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message, sql: SQL },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, message: "Realtime enabled for orders and contact_messages" });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
