const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Starting database migration...');

    // First, try to drop the existing constraint
    console.log('Dropping existing constraint...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;'
    });

    if (dropError) {
      console.log('Drop constraint error (might not exist):', dropError.message);
    }

    // Add new constraint with 'card' included
    console.log('Adding new constraint...');
    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: "ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('mpesa', 'mpesa_till', 'mpesa_paybill', 'whatsapp', 'card'));"
    });

    if (addError) {
      console.error('Add constraint error:', addError);
      return;
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
