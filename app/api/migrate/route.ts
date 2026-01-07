import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Drop existing constraint
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;'
    });

    if (dropError) {
      console.error('Error dropping constraint:', dropError);
    }

    // Add new constraint with 'card' included
    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: "ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'whatsapp', 'card'));"
    });

    if (addError) {
      console.error('Error adding constraint:', addError);
      return NextResponse.json({ error: addError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
