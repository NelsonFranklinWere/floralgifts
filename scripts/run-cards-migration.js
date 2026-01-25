// Script to run the cards category migration directly
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (value) {
        process.env[key.trim()] = value.replace(/^["']|["']$/g, ''); // Remove quotes
      }
    }
  });
}

async function runCardsMigration() {
  console.log('🔄 Running cards category migration...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // First, let's try to insert a test product with cards category
    console.log('Testing cards category insertion...');
    const testProduct = {
      title: 'Migration Test Card',
      slug: 'migration-test-card-' + Date.now(),
      description: 'Test card for migration',
      short_description: 'Test card',
      price: 100,
      category: 'cards',
      subcategory: null,
      tags: [],
      teddy_size: null,
      teddy_color: null,
      images: ['https://example.com/test.jpg'],
      included_items: null,
      upsells: null
    };

    const { data, error } = await supabase
      .from('products')
      .insert(testProduct)
      .select();

    if (error) {
      console.error('❌ Cards category not allowed in database:', error.message);
      console.log('🔧 Attempting to update database constraint...');

      // The constraint needs to be updated. Since we can't use exec_sql,
      // let's try a different approach - we'll update via the API route
      console.log('📞 Calling migration API...');
      const response = await fetch('https://floralwhispersgifts.co.ke/api/migrate?type=cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.error && result.error.includes('exec_sql')) {
        console.log('⚠️  exec_sql not available. Please run this SQL in your Supabase dashboard:');
        console.log('');
        console.log('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;');
        console.log("ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('flowers', 'hampers', 'teddy', 'wines', 'chocolates', 'cards'));");
        console.log('');
        process.exit(1);
      } else if (result.success) {
        console.log('✅ Migration completed via API!');
        return true;
      } else {
        console.error('❌ Migration failed:', result.error);
        return false;
      }
    } else {
      console.log('✅ Cards category is already working! Test product ID:', data[0].id);

      // Clean up test product
      await supabase.from('products').delete().eq('id', data[0].id);
      console.log('🧹 Test product cleaned up');
      return true;
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    return false;
  }
}

runCardsMigration().then(success => {
  if (success) {
    console.log('🎉 Cards category migration completed successfully!');
  } else {
    console.log('❌ Cards category migration failed.');
  }
  process.exit(success ? 0 : 1);
});
