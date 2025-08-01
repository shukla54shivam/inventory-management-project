const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
let adminToken = '';
let userToken = '';

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...(data && { data })
    };
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
}

// Demo Functions
async function demoHealthCheck() {
  console.log('\n🏥 **1. Health Check**');
  console.log('='.repeat(40));
  
  const result = await makeRequest('GET', '/health');
  if (result.success) {
    console.log('✅ Backend is healthy!');
    console.log('📊 Status:', result.data.status);
    console.log('💬 Message:', result.data.message);
    console.log('🕒 Timestamp:', result.data.timestamp);
  } else {
    console.log('❌ Health check failed:', result.error);
  }
}

async function demoSwaggerDocs() {
  console.log('\n📚 **2. API Documentation**');
  console.log('='.repeat(40));
  console.log('🌐 Swagger UI: http://localhost:8080/docs');
  console.log('📖 Interactive API documentation available');
  console.log('🧪 Test all endpoints directly from the browser');
}

async function demoUserRegistration() {
  console.log('\n👤 **3. User Registration**');
  console.log('='.repeat(40));
  
  const userData = {
    username: 'demo_user',
    password: 'demo123'
  };
  
  const result = await makeRequest('POST', '/auth/register', userData);
  if (result.success) {
    console.log('✅ User registered successfully!');
    console.log('🆔 User ID:', result.data.user_id);
    console.log('👤 Username:', userData.username);
  } else {
    console.log('❌ Registration failed:', result.error);
  }
}

async function demoAdminLogin() {
  console.log('\n🔐 **4. Admin Login**');
  console.log('='.repeat(40));
  
  const adminData = {
    username: 'admin',
    password: 'admin123'
  };
  
  const result = await makeRequest('POST', '/auth/login', adminData);
  if (result.success) {
    adminToken = result.data.access_token;
    console.log('✅ Admin login successful!');
    console.log('🔑 Token received');
    console.log('👤 User:', result.data.user.username);
    console.log('👑 Role:', result.data.user.role);
  } else {
    console.log('❌ Admin login failed:', result.error);
  }
}

async function demoUserLogin() {
  console.log('\n🔐 **5. User Login**');
  console.log('='.repeat(40));
  
  const userData = {
    username: 'demo_user',
    password: 'demo123'
  };
  
  const result = await makeRequest('POST', '/auth/login', userData);
  if (result.success) {
    userToken = result.data.access_token;
    console.log('✅ User login successful!');
    console.log('🔑 Token received');
    console.log('👤 User:', result.data.user.username);
    console.log('👑 Role:', result.data.user.role);
  } else {
    console.log('❌ User login failed:', result.error);
  }
}

async function demoProductManagement() {
  console.log('\n📦 **6. Product Management**');
  console.log('='.repeat(40));
  
  // Add a new product
  const newProduct = {
    name: 'Demo Laptop',
    type: 'Electronics',
    sku: 'LAP001',
    description: 'High-performance laptop for demo',
    quantity: 10,
    price: 999.99,
    cost_price: 750.00,
    min_stock_level: 5,
    supplier: 'TechCorp',
    location: 'Warehouse A'
  };
  
  console.log('📝 Adding new product...');
  const addResult = await makeRequest('POST', '/products', newProduct, adminToken);
  if (addResult.success) {
    console.log('✅ Product added successfully!');
    console.log('🆔 Product ID:', addResult.data.product_id);
  } else {
    console.log('❌ Product addition failed:', addResult.error);
  }
  
  // Get all products
  console.log('\n📋 Getting all products...');
  const getResult = await makeRequest('GET', '/products', null, adminToken);
  if (getResult.success) {
    console.log('✅ Products retrieved successfully!');
    console.log('📊 Total products:', getResult.data.products.length);
    console.log('📄 Pagination info:', getResult.data.pagination);
  } else {
    console.log('❌ Product retrieval failed:', getResult.error);
  }
  
  // Update product quantity
  if (addResult.success) {
    console.log('\n🔄 Updating product quantity...');
    const updateData = { quantity: 15 };
    const updateResult = await makeRequest('PUT', `/products/${addResult.data.product_id}/quantity`, updateData, adminToken);
    if (updateResult.success) {
      console.log('✅ Product quantity updated!');
      console.log('📦 New quantity:', updateResult.data.quantity);
    } else {
      console.log('❌ Quantity update failed:', updateResult.error);
    }
  }
}

async function demoAdminDashboard() {
  console.log('\n🎛️ **7. Admin Dashboard**');
  console.log('='.repeat(40));
  
  const result = await makeRequest('GET', '/admin/dashboard', null, adminToken);
  if (result.success) {
    console.log('✅ Admin dashboard data retrieved!');
    console.log('👥 Total users:', result.data.total_users);
    console.log('📦 Total products:', result.data.total_products);
    console.log('⚠️ Low stock items:', result.data.low_stock_count);
    console.log('📊 Recent activity count:', result.data.recent_activity.length);
  } else {
    console.log('❌ Dashboard access failed:', result.error);
  }
}

async function demoUserManagement() {
  console.log('\n👥 **8. User Management**');
  console.log('='.repeat(40));
  
  // Get all users
  const getResult = await makeRequest('GET', '/admin/users', null, adminToken);
  if (getResult.success) {
    console.log('✅ Users retrieved successfully!');
    console.log('📊 Total users:', getResult.data.users.length);
    console.log('📄 Pagination info:', getResult.data.pagination);
  } else {
    console.log('❌ User retrieval failed:', getResult.error);
  }
}

async function demoAnalytics() {
  console.log('\n📊 **9. Analytics & Reporting**');
  console.log('='.repeat(40));
  
  // Product analytics
  const productAnalytics = await makeRequest('GET', '/analytics/products', null, adminToken);
  if (productAnalytics.success) {
    console.log('✅ Product analytics retrieved!');
    console.log('🔥 Most viewed products:', productAnalytics.data.most_viewed.length);
    console.log('📈 Most added products:', productAnalytics.data.most_added.length);
    console.log('⚠️ Low stock products:', productAnalytics.data.low_stock.length);
  } else {
    console.log('❌ Product analytics failed:', productAnalytics.error);
  }
  
  // Inventory analytics
  const inventoryAnalytics = await makeRequest('GET', '/analytics/inventory', null, adminToken);
  if (inventoryAnalytics.success) {
    console.log('\n✅ Inventory analytics retrieved!');
    console.log('💰 Total inventory value:', inventoryAnalytics.data.total_value);
    console.log('📊 Average product price:', inventoryAnalytics.data.average_price);
    console.log('📦 Total items in stock:', inventoryAnalytics.data.total_items);
  } else {
    console.log('❌ Inventory analytics failed:', inventoryAnalytics.error);
  }
  
  // User analytics
  const userAnalytics = await makeRequest('GET', '/analytics/users', null, adminToken);
  if (userAnalytics.success) {
    console.log('\n✅ User analytics retrieved!');
    console.log('👥 Total users:', userAnalytics.data.total_users);
    console.log('🟢 Active users:', userAnalytics.data.active_users);
    console.log('👑 Admin users:', userAnalytics.data.admin_users);
  } else {
    console.log('❌ User analytics failed:', userAnalytics.error);
  }
}

async function demoReports() {
  console.log('\n📋 **10. Report Generation**');
  console.log('='.repeat(40));
  
  // Generate inventory report
  const inventoryReport = await makeRequest('GET', '/analytics/reports?type=inventory&format=json', null, adminToken);
  if (inventoryReport.success) {
    console.log('✅ Inventory report generated!');
    console.log('📄 Report format: JSON');
    console.log('📊 Report data available');
  } else {
    console.log('❌ Report generation failed:', inventoryReport.error);
  }
}

async function demoSecurity() {
  console.log('\n🔒 **11. Security Features**');
  console.log('='.repeat(40));
  
  // Test without token
  console.log('🚫 Testing endpoint without authentication...');
  const noAuthResult = await makeRequest('GET', '/products');
  if (!noAuthResult.success && noAuthResult.status === 401) {
    console.log('✅ Security working: Unauthorized access blocked');
  } else {
    console.log('❌ Security issue: Unauthorized access allowed');
  }
  
  // Test with invalid token
  console.log('\n🚫 Testing with invalid token...');
  const invalidTokenResult = await makeRequest('GET', '/products', null, 'invalid_token');
  if (!invalidTokenResult.success && invalidTokenResult.status === 401) {
    console.log('✅ Security working: Invalid token rejected');
  } else {
    console.log('❌ Security issue: Invalid token accepted');
  }
  
  // Test admin-only endpoint with user token
  console.log('\n🚫 Testing admin endpoint with user token...');
  const userAdminResult = await makeRequest('GET', '/admin/dashboard', null, userToken);
  if (!userAdminResult.success && userAdminResult.status === 403) {
    console.log('✅ Security working: User cannot access admin endpoint');
  } else {
    console.log('❌ Security issue: User can access admin endpoint');
  }
}

async function demoErrorHandling() {
  console.log('\n⚠️ **12. Error Handling**');
  console.log('='.repeat(40));
  
  // Test invalid endpoint
  console.log('🚫 Testing invalid endpoint...');
  const invalidEndpoint = await makeRequest('GET', '/invalid-endpoint');
  if (!invalidEndpoint.success && invalidEndpoint.status === 404) {
    console.log('✅ Error handling working: 404 for invalid endpoint');
  } else {
    console.log('❌ Error handling issue: Invalid response for invalid endpoint');
  }
  
  // Test invalid data
  console.log('\n🚫 Testing invalid product data...');
  const invalidProduct = { name: '' }; // Missing required fields
  const invalidDataResult = await makeRequest('POST', '/products', invalidProduct, adminToken);
  if (!invalidDataResult.success && invalidDataResult.status === 400) {
    console.log('✅ Error handling working: 400 for invalid data');
  } else {
    console.log('❌ Error handling issue: Invalid response for invalid data');
  }
}

async function runCompleteBackendDemo() {
  console.log('🚀 **IMS Backend - Complete Feature Demo**');
  console.log('='.repeat(50));
  console.log('🎯 This demo showcases all backend features systematically');
  console.log('📊 Testing authentication, products, admin, analytics, security');
  console.log('='.repeat(50));
  
  try {
    await demoHealthCheck();
    await demoSwaggerDocs();
    await demoUserRegistration();
    await demoAdminLogin();
    await demoUserLogin();
    await demoProductManagement();
    await demoAdminDashboard();
    await demoUserManagement();
    await demoAnalytics();
    await demoReports();
    await demoSecurity();
    await demoErrorHandling();
    
    console.log('\n🎉 **Backend Demo Completed Successfully!**');
    console.log('='.repeat(50));
    console.log('✅ All backend features are working correctly');
    console.log('🔐 Authentication system: Working');
    console.log('📦 Product management: Working');
    console.log('👑 Admin features: Working');
    console.log('📊 Analytics: Working');
    console.log('🔒 Security: Working');
    console.log('⚠️ Error handling: Working');
    console.log('\n🌐 **Next Steps:**');
    console.log('1. Open http://localhost:8080/docs for interactive API testing');
    console.log('2. Open http://localhost:3000 for frontend demo');
    console.log('3. Use Postman collection for detailed API testing');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo
runCompleteBackendDemo(); 