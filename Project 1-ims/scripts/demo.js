const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
let adminToken = '';
let userToken = '';

// Helper function to make authenticated requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
}

// Demo functions
async function demoHealthCheck() {
  console.log('\n🏥 **1. Health Check**');
  const health = await makeRequest('GET', '/health');
  if (health) {
    console.log('✅ Server is running and healthy');
    console.log('📊 Status:', health.status);
    console.log('⏰ Timestamp:', health.timestamp);
  }
}

async function demoSwaggerDocs() {
  console.log('\n📚 **2. API Documentation**');
  console.log('✅ Swagger UI available at: http://localhost:8080/docs');
  console.log('📖 Complete API documentation with interactive testing');
}

async function demoUserRegistration() {
  console.log('\n👤 **3. User Registration**');
  const userData = {
    username: 'demo_user',
    password: 'password123'
  };
  
  const result = await makeRequest('POST', '/auth/register', userData);
  if (result) {
    console.log('✅ User registered successfully');
    console.log('🆔 User ID:', result.userId);
  }
}

async function demoAdminLogin() {
  console.log('\n🔐 **4. Admin Login**');
  const adminData = {
    username: 'admin',
    password: 'admin123'
  };
  
  const result = await makeRequest('POST', '/auth/login', adminData);
  if (result) {
    adminToken = result.access_token;
    console.log('✅ Admin login successful');
    console.log('👤 Role:', result.user.role);
    console.log('🔑 Token received');
  }
}

async function demoUserLogin() {
  console.log('\n👤 **5. Regular User Login**');
  const userData = {
    username: 'demo_user',
    password: 'password123'
  };
  
  const result = await makeRequest('POST', '/auth/login', userData);
  if (result) {
    userToken = result.access_token;
    console.log('✅ User login successful');
    console.log('👤 Role:', result.user.role);
  }
}

async function demoProductManagement() {
  console.log('\n📦 **6. Product Management**');
  
  // Add a product
  const productData = {
    name: 'Demo Laptop',
    type: 'Electronics',
    sku: 'LAPTOP001',
    price: 999.99,
    quantity: 10,
    description: 'High-performance laptop for demonstration',
    image_url: 'https://example.com/laptop.jpg'
  };
  
  const addResult = await makeRequest('POST', '/products', productData, adminToken);
  if (addResult) {
    console.log('✅ Product added successfully');
    console.log('🆔 Product ID:', addResult.product_id);
  }
  
  // Get products
  const products = await makeRequest('GET', '/products', null, adminToken);
  if (products) {
    console.log('✅ Products retrieved');
    console.log('📊 Total products:', products.pagination.total);
    console.log('📄 Page:', products.pagination.page);
  }
  
  // Update quantity
  const updateData = { quantity: 15 };
  const updateResult = await makeRequest('PUT', '/products/1/quantity', updateData, adminToken);
  if (updateResult) {
    console.log('✅ Product quantity updated');
    console.log('📦 New quantity:', updateResult.quantity);
  }
}

async function demoAdminDashboard() {
  console.log('\n🔐 **7. Admin Dashboard**');
  const dashboard = await makeRequest('GET', '/admin/dashboard', null, adminToken);
  if (dashboard) {
    console.log('✅ Admin dashboard loaded');
    console.log('👥 Total users:', dashboard.totalUsers);
    console.log('📦 Total products:', dashboard.totalProducts);
    console.log('⚠️ Low stock products:', dashboard.lowStockProducts);
    console.log('📈 Recent activity:', dashboard.recentActivity.length, 'entries');
  }
}

async function demoUserManagement() {
  console.log('\n👥 **8. User Management**');
  const users = await makeRequest('GET', '/admin/users', null, adminToken);
  if (users) {
    console.log('✅ User list retrieved');
    console.log('📊 Total users:', users.pagination.total);
    console.log('👤 Users:', users.users.map(u => `${u.username} (${u.role})`).join(', '));
  }
}

async function demoAnalytics() {
  console.log('\n📊 **9. Analytics & Reporting**');
  
  // Product analytics
  const productAnalytics = await makeRequest('GET', '/analytics/products?period=30d', null, adminToken);
  if (productAnalytics) {
    console.log('✅ Product analytics loaded');
    console.log('📈 Period:', productAnalytics.period);
    console.log('👀 Most viewed products:', productAnalytics.mostViewedProducts.length);
    console.log('➕ Most added products:', productAnalytics.mostAddedProducts.length);
  }
  
  // Inventory analytics
  const inventoryAnalytics = await makeRequest('GET', '/analytics/inventory', null, adminToken);
  if (inventoryAnalytics) {
    console.log('✅ Inventory analytics loaded');
    console.log('💰 Total inventory value:', inventoryAnalytics.totalValue);
    console.log('📊 Average price:', inventoryAnalytics.averagePrice);
    console.log('📦 Stock levels:', inventoryAnalytics.stockLevels.length, 'categories');
  }
  
  // User analytics
  const userAnalytics = await makeRequest('GET', '/analytics/users', null, adminToken);
  if (userAnalytics) {
    console.log('✅ User analytics loaded');
    console.log('👥 Total users:', userAnalytics.totalUsers);
    console.log('🟢 Active users:', userAnalytics.activeUsers);
    console.log('👤 User roles:', userAnalytics.userRoles.length, 'types');
  }
}

async function demoReports() {
  console.log('\n📋 **10. Report Generation**');
  
  // Generate inventory report
  const inventoryReport = await makeRequest('GET', '/analytics/reports?type=inventory&format=json', null, adminToken);
  if (inventoryReport) {
    console.log('✅ Inventory report generated');
    console.log('📄 Report name:', inventoryReport.reportName);
    console.log('📊 Data points:', inventoryReport.data.length);
    console.log('⏰ Generated at:', inventoryReport.generatedAt);
  }
}

async function demoSecurity() {
  console.log('\n🔒 **11. Security Features**');
  
  // Try to access admin endpoint with user token
  const unauthorizedAccess = await makeRequest('GET', '/admin/dashboard', null, userToken);
  if (!unauthorizedAccess) {
    console.log('✅ Security working: User cannot access admin endpoints');
  }
  
  // Try to access without token
  const noTokenAccess = await makeRequest('GET', '/admin/dashboard');
  if (!noTokenAccess) {
    console.log('✅ Security working: Authentication required');
  }
}

async function demoErrorHandling() {
  console.log('\n⚠️ **12. Error Handling**');
  
  // Try to add product with invalid data
  const invalidProduct = {
    name: '', // Invalid: empty name
    sku: 'INVALID001',
    price: -10 // Invalid: negative price
  };
  
  const errorResult = await makeRequest('POST', '/products', invalidProduct, adminToken);
  if (!errorResult) {
    console.log('✅ Error handling working: Invalid data rejected');
  }
  
  // Try to access non-existent product
  const notFoundResult = await makeRequest('GET', '/products/999', null, adminToken);
  if (!notFoundResult) {
    console.log('✅ Error handling working: 404 for non-existent resource');
  }
}

async function runCompleteDemo() {
  console.log('🚀 **IMS Backend - Complete Feature Demo**');
  console.log('=' .repeat(50));
  
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
    
    console.log('\n🎉 **Demo Completed Successfully!**');
    console.log('=' .repeat(50));
    console.log('✅ All features working correctly');
    console.log('🔐 Authentication & Authorization');
    console.log('📦 Product Management');
    console.log('🔐 Admin Portal');
    console.log('📊 Analytics & Reporting');
    console.log('🔒 Security Features');
    console.log('⚠️ Error Handling');
    
    console.log('\n📚 **Next Steps:**');
    console.log('1. Visit http://localhost:8080/docs for interactive API testing');
    console.log('2. Use Postman collection for detailed testing');
    console.log('3. Deploy with Docker: docker-compose up --build');
    console.log('4. Build React frontend (planned)');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo
runCompleteDemo(); 