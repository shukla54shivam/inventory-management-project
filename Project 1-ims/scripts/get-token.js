const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function getToken() {
  console.log('🔑 **Getting JWT Token**');
  console.log('='.repeat(40));
  
  try {
    // Login as admin to get token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.access_token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login successful!');
    console.log('👤 User:', user.username);
    console.log('👑 Role:', user.role);
    console.log('🔑 Token:', token.substring(0, 50) + '...');
    
    console.log('\n📋 **How to use this token:**');
    console.log('='.repeat(40));
    console.log('1. In Swagger UI (http://localhost:8080/docs):');
    console.log('   - Click "Authorize" button');
    console.log('   - Enter: Bearer ' + token);
    console.log('   - Click "Authorize"');
    console.log('   - Now test all endpoints!');
    
    console.log('\n2. In curl commands:');
    console.log('   curl -H "Authorization: Bearer ' + token + '" http://localhost:8080/products');
    
    console.log('\n3. In Postman:');
    console.log('   - Add header: Authorization');
    console.log('   - Value: Bearer ' + token);
    
    console.log('\n4. In your frontend:');
    console.log('   - Store token in localStorage');
    console.log('   - Add to axios headers');
    
    // Test the token works
    console.log('\n🧪 **Testing token...**');
    const testResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Token works! Products count:', testResponse.data.products.length);
    
    return token;
    
  } catch (error) {
    console.error('❌ Failed to get token:', error.response?.data || error.message);
  }
}

getToken(); 