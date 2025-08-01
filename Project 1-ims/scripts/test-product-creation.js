const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testProductCreation() {
  console.log('🧪 **Testing Product Creation**');
  console.log('='.repeat(40));

  try {
    // Step 1: Login to get token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful!');

    // Step 2: Test with minimal JSON
    console.log('\n2️⃣ Testing with minimal JSON...');
    const minimalProduct = {
      "name": "Test Product",
      "sku": "TEST001",
      "quantity": 5,
      "price": 100.00
    };

    const minimalResponse = await axios.post(`${BASE_URL}/products`, minimalProduct, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Minimal product created:', minimalResponse.data);

    // Step 3: Test with full JSON
    console.log('\n3️⃣ Testing with full JSON...');
    const fullProduct = {
      "name": "High-Performance Laptop",
      "type": "Electronics",
      "sku": "LAP002",
      "description": "Latest generation laptop with premium features",
      "quantity": 10,
      "price": 1299.99,
      "cost_price": 950.00,
      "min_stock_level": 3,
      "supplier": "TechCorp Inc",
      "location": "Warehouse A - Section 1"
    };

    const fullResponse = await axios.post(`${BASE_URL}/products`, fullProduct, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Full product created:', fullResponse.data);

    // Step 4: Get all products to verify
    console.log('\n4️⃣ Getting all products...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Total products:', productsResponse.data.products.length);

    console.log('\n🎉 **All Product Tests Passed!**');
    console.log('='.repeat(40));
    console.log('✅ Minimal JSON works');
    console.log('✅ Full JSON works');
    console.log('✅ Authorization works');
    console.log('✅ Product retrieval works');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.data?.error) {
      console.log('\n🔍 **JSON Error Analysis:**');
      console.log('Error:', error.response.data.error);
      console.log('This usually means invalid JSON syntax in your request.');
      console.log('Make sure to:');
      console.log('- Use quotes around all string values');
      console.log('- Use numbers without quotes for numeric values');
      console.log('- No trailing commas');
      console.log('- Valid JSON format');
    }
  }
}

testProductCreation(); 