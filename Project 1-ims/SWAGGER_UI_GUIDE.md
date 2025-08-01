# 🎯 **Swagger UI Step-by-Step Visual Guide**

## 🌐 **Step 1: Access Swagger UI**

**URL:** `http://localhost:8080/docs`

**What you'll see:**
```
┌─────────────────────────────────────────────────────────────┐
│                    IMS Backend API                          │
│                                                             │
│  [🔑 Authorize] [📖 Info] [🔗 Servers]                     │
│                                                             │
│  Authentication                                              │
│  ├── POST /auth/register                                    │
│  └── POST /auth/login                                       │
│                                                             │
│  Products                                                    │
│  ├── GET /products                                          │
│  ├── POST /products                                         │
│  └── PUT /products/{id}/quantity                            │
│                                                             │
│  Admin                                                       │
│  ├── GET /admin/dashboard                                   │
│  └── GET /admin/users                                       │
│                                                             │
│  Analytics                                                   │
│  ├── GET /analytics/products                                │
│  └── GET /analytics/inventory                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 **Step 2: Register a New User**

### **A. Find the Register Endpoint**
```
┌─────────────────────────────────────────────────────────────┐
│  Authentication                                              │
│  ├── POST /auth/register                                    │
│  │   [Try it out] [Schema]                                  │
│  └── POST /auth/login                                       │
└─────────────────────────────────────────────────────────────┘
```

### **B. Click "Try it out"**
```
┌─────────────────────────────────────────────────────────────┐
│  POST /auth/register                                        │
│                                                             │
│  [🔴 Try it out] ← Click this button!                      │
│                                                             │
│  Request body                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   "username": "demo_user",                              │ │
│  │   "password": "demo123"                                 │ │
│  │ }                                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  [Execute] ← Click this to send the request!               │
└─────────────────────────────────────────────────────────────┘
```

### **C. Expected Response**
```json
{
  "message": "User registered successfully",
  "userId": 7
}
```

---

## 🔑 **Step 3: Login to Get JWT Token**

### **A. Find the Login Endpoint**
```
┌─────────────────────────────────────────────────────────────┐
│  Authentication                                              │
│  ├── POST /auth/register                                    │
│  └── POST /auth/login                                       │
│      [Try it out] ← Click this!                            │
└─────────────────────────────────────────────────────────────┘
```

### **B. Enter Login Credentials**
```
┌─────────────────────────────────────────────────────────────┐
│  POST /auth/login                                           │
│                                                             │
│  Request body                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   "username": "admin",                                  │ │
│  │   "password": "admin123"                                │ │
│  │ }                                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  [Execute] ← Click this!                                   │
└─────────────────────────────────────────────────────────────┘
```

### **C. Copy the JWT Token**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```
**📋 Copy the entire `access_token` value!**

---

## 🔐 **Step 4: Authorize with JWT Token**

### **A. Click the Authorize Button**
```
┌─────────────────────────────────────────────────────────────┐
│                    IMS Backend API                          │
│                                                             │
│  [🔑 Authorize] ← Click this green button!                 │
│                                                             │
│  [📖 Info] [🔗 Servers]                                    │
└─────────────────────────────────────────────────────────────┘
```

### **B. Enter the Bearer Token**
```
┌─────────────────────────────────────────────────────────────┐
│  Available authorizations                                   │
│                                                             │
│  bearerAuth (http)                                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...        │ │
│  │ ← Paste your token here!                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  [Authorize] [Close] ← Click Authorize!                    │
└─────────────────────────────────────────────────────────────┘
```

**💡 Important:** Make sure to include `Bearer ` before your token!

---

## 🧪 **Step 5: Test Protected Endpoints**

### **Test 1: Get All Products**
```
┌─────────────────────────────────────────────────────────────┐
│  Products                                                   │
│  ├── GET /products                                          │
│  │   [Try it out] ← Click this!                            │
│  │                                                         │
│  │   [Execute] ← Click this!                               │
│  │                                                         │
│  │   Expected Response:                                     │
│  │   {                                                     │
│  │     "products": [...],                                  │
│  │     "pagination": {...}                                 │
│  │   }                                                     │
│  └── POST /products                                        │
└─────────────────────────────────────────────────────────────┘
```

### **Test 2: Add a New Product**
```
┌─────────────────────────────────────────────────────────────┐
│  POST /products                                             │
│                                                             │
│  Request body                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ {                                                       │ │
│  │   "name": "Test Laptop",                                │ │
│  │   "type": "Electronics",                                │ │
│  │   "sku": "LAP001",                                      │ │
│  │   "description": "High-performance laptop",             │ │
│  │   "quantity": 10,                                       │ │
│  │   "price": 999.99,                                      │ │
│  │   "cost_price": 750.00,                                 │ │
│  │   "min_stock_level": 5,                                 │ │
│  │   "supplier": "TechCorp",                               │ │
│  │   "location": "Warehouse A"                             │ │
│  │ }                                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  [Execute] ← Click this!                                   │
└─────────────────────────────────────────────────────────────┘
```

### **Test 3: Admin Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│  Admin                                                      │
│  ├── GET /admin/dashboard                                   │
│  │   [Try it out] ← Click this!                            │
│  │                                                         │
│  │   [Execute] ← Click this!                               │
│  │                                                         │
│  │   Expected Response:                                     │
│  │   {                                                     │
│  │     "totalUsers": 6,                                    │
│  │     "totalProducts": 2,                                 │
│  │     "lowStockProducts": 0,                              │
│  │     "recentActivity": []                                │
│  │   }                                                     │
│  └── GET /admin/users                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ **Success Indicators**

### **✅ Authentication Working**
- Register: `201 Created`
- Login: `200 OK` with JWT token

### **✅ Authorization Working**
- Products: `200 OK` with data
- Admin: `200 OK` with dashboard data
- No more `401 Unauthorized` errors

### **✅ Full System Working**
- Can register users
- Can login and get tokens
- Can access protected endpoints
- Can perform CRUD operations

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "401 Unauthorized"**
**Solution:** Make sure you:
1. ✅ Clicked "Authorize" button
2. ✅ Entered `Bearer ` before your token
3. ✅ Copied the full token (not just part of it)

### **Issue 2: "403 Forbidden"**
**Solution:** Make sure you:
1. ✅ Logged in as admin user (`admin`/`admin123`)
2. ✅ Using admin token for admin endpoints

### **Issue 3: "409 Conflict"**
**Solution:** 
1. ✅ Use unique usernames for registration
2. ✅ Use unique SKUs for products

---

## 🎯 **Quick Test Checklist**

- [ ] Can access `http://localhost:8080/docs`
- [ ] Can register a new user
- [ ] Can login and get JWT token
- [ ] Can click "Authorize" and enter token
- [ ] Can access `GET /products` (protected)
- [ ] Can access `GET /admin/dashboard` (admin only)
- [ ] Can add a new product with `POST /products`

**🎉 If all checkboxes are checked, your system is working perfectly!** 