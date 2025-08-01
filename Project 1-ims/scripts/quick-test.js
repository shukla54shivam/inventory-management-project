const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testEndpoints() {
  console.log('🧪 **Quick Backend Test**');
  console.log('='.repeat(40));
  
  try {
    // 1. Test Health Check (GET)
    console.log('\n1️⃣ Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data);
    
    // 2. Test User Registration (POST)
    console.log('\n2️⃣ Testing User Registration...');
    const registerData = {
      username: 'testuser_' + Date.now(),
      password: 'test123'
    };
    const register = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration:', register.data);
    
    // 3. Test User Login (POST)
    console.log('\n3️⃣ Testing User Login...');
    const loginData = {
      username: registerData.username,
      password: registerData.password
    };
    const login = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login:', { 
      user: login.data.user.username,
      role: login.data.user.role,
      token: login.data.access_token.substring(0, 20) + '...'
    });
    
    // 4. Test Admin Login (POST)
    console.log('\n4️⃣ Testing Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Admin Login:', { 
      user: adminLogin.data.user.username,
      role: adminLogin.data.user.role
    });
    
    // 5. Test Products with Authentication (GET)
    console.log('\n5️⃣ Testing Products (with auth)...');
    const products = await axios.get(`${BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${adminLogin.data.access_token}` }
    });
    console.log('✅ Products:', {
      count: products.data.products.length,
      pagination: products.data.pagination
    });
    
    // 6. Test Admin Dashboard (GET)
    console.log('\n6️⃣ Testing Admin Dashboard...');
    const dashboard = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminLogin.data.access_token}` }
    });
    console.log('✅ Dashboard:', dashboard.data);
    
    console.log('\n🎉 **All Tests Passed!**');
    console.log('='.repeat(40));
    console.log('✅ Backend is working perfectly!');
    console.log('🌐 Swagger UI: http://localhost:8080/docs');
    console.log('📱 Frontend: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testEndpoints(); 