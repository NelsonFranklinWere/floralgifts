const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCardsCategory() {
  try {
    console.log('Testing cards category...');

    // First, let's try to insert a test product with cards category
    const testProduct = {
      title: 'Test Card',
      slug: 'test-card-' + Date.now(),
      description: 'Test card product',
      short_description: 'Test card',
      price: 100,
      category: 'cards',
      images: ['https://example.com/test.jpg'],
      tags: ['test'],
      status: 'active'
    };

    const { data, error } = await supabase
      .from('products')
      .insert(testProduct)
      .select();

    if (error) {
      console.error('Error inserting cards product:', error);
      return false;
    }

    console.log('✅ Cards category works! Product inserted:', data[0].id);

    // Clean up - delete the test product
    await supabase.from('products').delete().eq('id', data[0].id);
    console.log('🧹 Test product cleaned up');

    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

testCardsCategory().then(success => {
  console.log(success ? '🎉 Cards category is working!' : '❌ Cards category is NOT working');
  process.exit(success ? 0 : 1);
});
