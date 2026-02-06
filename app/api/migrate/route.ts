import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const migrationType = url.searchParams.get('type');

  try {
    if (migrationType === 'cards') {
      // Update products category constraint to include 'cards'
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;'
      });

      if (dropError) {
        console.error('Error dropping products constraint:', dropError);
      }

      const { error: addError } = await supabase.rpc('exec_sql', {
        sql: "ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates', 'cards'));"
      });

      if (addError) {
        console.error('Error adding products constraint:', addError);
        return NextResponse.json({ error: addError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Cards category migration completed successfully' });
    } else {
      // Original orders payment method migration
      // Drop existing constraint
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;'
      });

      if (dropError) {
        console.error('Error dropping orders constraint:', dropError);
      }

      // Add new constraint with 'card' included
      const { error: addError } = await supabase.rpc('exec_sql', {
        sql: "ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'whatsapp', 'card'));"
      });

      if (addError) {
        console.error('Error adding orders constraint:', addError);
        return NextResponse.json({ error: addError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Orders payment method migration completed successfully' });
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
