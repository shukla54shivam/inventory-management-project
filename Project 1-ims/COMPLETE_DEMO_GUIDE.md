# 🚀 **Complete IMS Feature Demo Guide**

## 📋 **Quick Start Commands**

```bash
# Terminal 1: Start Backend
npm start

# Terminal 2: Start Frontend  
cd frontend && npm start
```

---

## 🌐 **Access Points**

- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080/docs
- **Frontend:** http://localhost:3000
- **Health Check:** http://localhost:8080/health

---

## 🎯 **Feature 1: Health Check & Server Status**

### **Method 1: Browser**
1. Open: `http://localhost:8080/health`
2. **Expected Response:**
```json
{
  "status": "OK",
  "message": "IMS Backend is running",
  "timestamp": "2025-07-30T..."
}
```

### **Method 2: Terminal**
```bash
curl http://localhost:8080/health
```

### **Method 3: Demo Script**
```bash
node scripts/quick-test.js
```

---

## 🔐 **Feature 2: Authentication System**

### **Step 1: User Registration**
**URL:** `http://localhost:8080/docs`

1. Open Swagger UI
2. Find `POST /auth/register`
3. Click "Try it out"
4. Enter:
```json
{
  "username": "demo_user",
  "password": "demo123"
}
```
5. Click "Execute"
6. **Expected:** 201 Created with user ID

### **Step 2: User Login**
1. Find `POST /auth/login`
2. Enter:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
3. **Expected:** 200 OK with JWT token

### **Step 3: Get Token for Testing**
```bash
node scripts/get-token.js
```

---

## 📦 **Feature 3: Product Management**

### **Step 1: View All Products**
**URL:** `http://localhost:8080/docs`

1. **Authorize first:**
   - Click "Authorize" button
   - Enter: `Bearer YOUR_JWT_TOKEN`
   - Click "Authorize"

2. **Get Products:**
   - Find `GET /products`
   - Click "Try it out"
   - Click "Execute"
   - **Expected:** List of products with pagination

### **Step 2: Add New Product**
1. Find `POST /products`
2. Enter product data:
```json
{
  "name": "Demo Laptop",
  "type": "Electronics",
  "sku": "LAP001",
  "description": "High-performance laptop",
  "quantity": 10,
  "price": 999.99,
  "cost_price": 750.00,
  "min_stock_level": 5,
  "supplier": "TechCorp",
  "location": "Warehouse A"
}
```
3. **Expected:** 201 Created with product ID

### **Step 3: Update Product Quantity**
1. Find `PUT /products/{id}/quantity`
2. Enter:
```json
{
  "quantity": 15
}
```
3. **Expected:** Updated product data

### **Step 4: Get Single Product**
1. Find `GET /products/{id}`
2. Enter product ID
3. **Expected:** Product details

---

## 👑 **Feature 4: Admin Dashboard**

### **Step 1: Access Admin Dashboard**
1. **Must be logged in as admin**
2. Find `GET /admin/dashboard`
3. Click "Execute"
4. **Expected:**
```json
{
  "totalUsers": 4,
  "totalProducts": 2,
  "lowStockProducts": 0,
  "recentActivity": []
}
```

### **Step 2: User Management**
1. Find `GET /admin/users`
2. **Expected:** List of all users with roles

### **Step 3: Update User Role**
1. Find `PUT /admin/users/{id}`
2. Enter:
```json
{
  "role": "admin",
  "is_active": true
}
```

---

## 📊 **Feature 5: Analytics & Reporting**

### **Step 1: Product Analytics**
1. Find `GET /analytics/products`
2. **Expected:**
```json
{
  "most_viewed": [...],
  "most_added": [...],
  "low_stock": [...],
  "type_distribution": {...}
}
```

### **Step 2: Inventory Analytics**
1. Find `GET /analytics/inventory`
2. **Expected:**
```json
{
  "total_value": 1999.98,
  "average_price": 999.99,
  "total_items": 2,
  "stock_levels": {...}
}
```

### **Step 3: User Analytics**
1. Find `GET /analytics/users`
2. **Expected:**
```json
{
  "total_users": 4,
  "active_users": 4,
  "admin_users": 1,
  "recent_logins": [...]
}
```

### **Step 4: Generate Reports**
1. Find `GET /analytics/reports`
2. Parameters:
   - `type`: inventory/products/users
   - `format`: json/csv
3. **Expected:** Report data

---

## 🔒 **Feature 6: Security Testing**

### **Test 1: Unauthorized Access**
1. **Without token:**
   - Find `GET /products`
   - Don't authorize
   - Click "Execute"
   - **Expected:** 401 Unauthorized

### **Test 2: Invalid Token**
1. **With invalid token:**
   - Authorize with: `Bearer invalid_token`
   - Try any endpoint
   - **Expected:** 401 Unauthorized

### **Test 3: User vs Admin Access**
1. **Login as regular user**
2. **Try admin endpoint:**
   - Find `GET /admin/dashboard`
   - **Expected:** 403 Forbidden

---

## ⚛️ **Feature 7: React Frontend**

### **Step 1: Access Frontend**
1. Open: `http://localhost:3000`
2. **Expected:** Login page

### **Step 2: Login**
1. **Admin credentials:**
   - Username: `admin`
   - Password: `admin123`
2. **Expected:** Dashboard with navigation

### **Step 3: Navigate Features**
1. **Dashboard:** Overview statistics
2. **Products:** Product management interface
3. **Analytics:** Charts and reports
4. **Admin:** Admin panel (if admin user)

---

## 🧪 **Feature 8: Automated Testing**

### **Quick Test**
```bash
node scripts/quick-test.js
```

### **Comprehensive Test**
```bash
node scripts/backend-demo.js
```

### **Authentication Test**
```bash
node scripts/test-with-auth.js
```

---

## 📱 **Feature 9: API Documentation**

### **Swagger UI Features**
1. **Interactive Testing:** Test all endpoints
2. **Request/Response Examples:** See data formats
3. **Authentication:** JWT token support
4. **Schema Validation:** Automatic validation

### **Available Endpoints**
- **Authentication:** Register, Login
- **Products:** CRUD operations
- **Admin:** Dashboard, User management
- **Analytics:** Reports, Statistics
- **Health:** Server status

---

## 🐳 **Feature 10: Docker Deployment**

### **Build and Run**
```bash
# Build image
docker build -t ims-backend .

# Run container
docker run -p 8080:8080 ims-backend

# Or use docker-compose
docker-compose up
```

---

## 🎯 **Interview Demo Strategy**

### **Phase 1: Backend Demo (5 minutes)**
1. **Health Check:** Show server is running
2. **Swagger UI:** Demonstrate API documentation
3. **Authentication:** Register user, login, get token
4. **Products:** Add, view, update products
5. **Security:** Show unauthorized access blocked

### **Phase 2: Advanced Features (5 minutes)**
1. **Admin Dashboard:** Show admin capabilities
2. **Analytics:** Demonstrate reporting features
3. **User Management:** Show role-based access
4. **Error Handling:** Show proper error responses

### **Phase 3: Frontend Demo (3 minutes)**
1. **Login Interface:** Show user authentication
2. **Dashboard:** Demonstrate UI/UX
3. **Navigation:** Show different sections
4. **Responsive Design:** Show mobile compatibility

### **Phase 4: Technical Deep Dive (5 minutes)**
1. **Code Architecture:** Explain folder structure
2. **Database Schema:** Show table relationships
3. **Security Implementation:** JWT, middleware
4. **API Design:** RESTful principles
5. **Testing Strategy:** Automated tests

---

## ✅ **Success Checklist**

- [ ] Backend server running on port 8080
- [ ] Frontend running on port 3000
- [ ] Health check endpoint working
- [ ] Swagger documentation accessible
- [ ] User registration working
- [ ] User login working
- [ ] JWT token generation working
- [ ] Product CRUD operations working
- [ ] Admin dashboard accessible
- [ ] Analytics endpoints working
- [ ] Security features working
- [ ] Frontend login working
- [ ] All automated tests passing

---

## 🚨 **Troubleshooting**

### **Port Already in Use**
```bash
# Stop existing processes
Get-Process -Name "node" | Stop-Process -Force
```

### **Database Issues**
```bash
# Delete and recreate database
Remove-Item -Path "ims.db" -Force
npm start
```

### **Frontend Issues**
```bash
# Clear cache and reinstall
cd frontend
npm install
npm start
```

---

## 🎉 **Demo Complete!**

Your Inventory Management System is now fully operational with:
- ✅ **Backend API** with authentication
- ✅ **Product Management** with CRUD operations
- ✅ **Admin Dashboard** with user management
- ✅ **Analytics & Reporting** with multiple reports
- ✅ **Security Features** with JWT authentication
- ✅ **React Frontend** with modern UI
- ✅ **API Documentation** with Swagger UI
- ✅ **Automated Testing** with comprehensive scripts
- ✅ **Docker Support** for deployment

**Ready for your interview!** 🚀 