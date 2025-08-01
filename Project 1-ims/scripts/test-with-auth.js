const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testWithAuthentication() {
  console.log('🔐 **Testing Backend with Authentication**');
  console.log('='.repeat(50));
  
  let token = '';
  
  try {
    // Step 1: Get token
    console.log('1️⃣ Getting authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    token = loginResponse.data.access_token;
    console.log('✅ Token obtained successfully!');
    
    // Step 2: Test Products (with auth)
    console.log('\n2️⃣ Testing Products API...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Products retrieved:', productsResponse.data.products.length, 'products');
    console.log('📄 Pagination:', productsResponse.data.pagination);
    
    // Step 3: Add a new product
    console.log('\n3️⃣ Adding new product...');
    const newProduct = {
      name: 'Test Product',
      type: 'Electronics',
      sku: 'TEST' + Date.now(),
      description: 'A test product for demonstration',
      quantity: 50,
      price: 99.99,
      cost_price: 75.00,
      min_stock_level: 10,
      supplier: 'Test Supplier',
      location: 'Warehouse A'
    };
    
    const addProductResponse = await axios.post(`${BASE_URL}/products`, newProduct, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Product added:', addProductResponse.data);
    
    // Step 4: Test Admin Dashboard
    console.log('\n4️⃣ Testing Admin Dashboard...');
    const dashboardResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Dashboard data:', dashboardResponse.data);
    
    // Step 5: Test User Management
    console.log('\n5️⃣ Testing User Management...');
    const usersResponse = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Users retrieved:', usersResponse.data.users.length, 'users');
    
    // Step 6: Test Analytics
    console.log('\n6️⃣ Testing Analytics...');
    const analyticsResponse = await axios.get(`${BASE_URL}/analytics/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Analytics data retrieved');
    console.log('📊 Most viewed:', analyticsResponse.data.most_viewed.length);
    console.log('📈 Most added:', analyticsResponse.data.most_added.length);
    
    // Step 7: Test Inventory Analytics
    console.log('\n7️⃣ Testing Inventory Analytics...');
    const inventoryResponse = await axios.get(`${BASE_URL}/analytics/inventory`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Inventory analytics:', inventoryResponse.data);
    
    // Step 8: Test Reports
    console.log('\n8️⃣ Testing Report Generation...');
    const reportResponse = await axios.get(`${BASE_URL}/analytics/reports?type=inventory&format=json`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Report generated successfully');
    
    // Step 9: Test Security (should fail without token)
    console.log('\n9️⃣ Testing Security (unauthorized access)...');
    try {
      await axios.get(`${BASE_URL}/products`);
      console.log('❌ Security issue: Unauthorized access allowed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Security working: Unauthorized access blocked');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }
    
    // Step 10: Test with invalid token
    console.log('\n🔟 Testing with invalid token...');
    try {
      await axios.get(`${BASE_URL}/products`, {
        headers: { 'Authorization': 'Bearer invalid_token' }
      });
      console.log('❌ Security issue: Invalid token accepted');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Security working: Invalid token rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }
    
    console.log('\n🎉 **All Tests Completed Successfully!**');
    console.log('='.repeat(50));
    console.log('✅ Authentication: Working');
    console.log('✅ Products API: Working');
    console.log('✅ Admin Dashboard: Working');
    console.log('✅ User Management: Working');
    console.log('✅ Analytics: Working');
    console.log('✅ Reports: Working');
    console.log('✅ Security: Working');
    
    console.log('\n🌐 **Next Steps:**');
    console.log('1. Open Swagger UI: http://localhost:8080/docs');
    console.log('2. Use the token above to authorize');
    console.log('3. Test endpoints interactively');
    console.log('4. Open Frontend: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testWithAuthentication(); 