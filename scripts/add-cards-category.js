const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addCardsCategory() {
  try {
    console.log('Adding cards category to products table...');

    // Drop existing constraint
    console.log('Dropping existing constraint...');
    const { error: dropError } = await supabase
      .from('products')
      .select('*')
      .limit(1); // Just to test connection

    if (dropError) {
      console.error('Database connection error:', dropError);
      return;
    }

    // Execute the migration SQL directly
    console.log('Updating category constraint...');

    // This will need to be run manually in Supabase SQL editor since rpc exec_sql is not available
    const migrationSQL = `
      -- Update products category constraint to include 'cards'
      ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
      ALTER TABLE products ADD CONSTRAINT products_category_check
        CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates', 'cards'));
    `;

    console.log('Please run this SQL in your Supabase SQL editor:');
    console.log('==================================================');
    console.log(migrationSQL);
    console.log('==================================================');

    console.log('Migration SQL prepared. Please execute it manually in Supabase.');

  } catch (error) {
    console.error('Migration script error:', error);
  }
}

addCardsCategory();
