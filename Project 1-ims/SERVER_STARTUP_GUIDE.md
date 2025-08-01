# 🚀 **Complete Server Startup Guide**

## 📋 **Quick Commands (PowerShell)**

```powershell
# Step 1: Stop all existing processes
Get-Process -Name "node" | Stop-Process -Force

# Step 2: Start Backend (Terminal 1)
cd C:\ims-backend
npm start

# Step 3: Start Frontend (Terminal 2)
cd C:\ims-backend\frontend
npm start
```

---

## 🌐 **Access Points**

- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080/docs
- **Frontend:** http://localhost:3000
- **Health Check:** http://localhost:8080/health

---

## ❌ **Common Mistakes & Solutions**

### **Mistake 1: Trying to access POST endpoints in browser**
- **❌ Wrong:** `http://localhost:8080/auth/register` (GET request)
- **✅ Correct:** Use Swagger UI or Postman for POST requests

### **Mistake 2: PowerShell syntax error**
- **❌ Wrong:** `cd frontend && npm start`
- **✅ Correct:** 
  ```powershell
  cd frontend
  npm start
  ```

### **Mistake 3: Port already in use**
- **❌ Error:** `Error: listen EADDRINUSE: address already in use :::8080`
- **✅ Solution:** `Get-Process -Name "node" | Stop-Process -Force`

---

## 🎯 **How to Test Each Feature**

### **1. Health Check (GET - Works in Browser)**
```bash
# Browser: http://localhost:8080/health
# Expected: {"status":"OK","message":"IMS Backend is running"}
```

### **2. API Documentation (GET - Works in Browser)**
```bash
# Browser: http://localhost:8080/docs
# Expected: Swagger UI interface
```

### **3. Authentication (POST - Use Swagger UI)**
```bash
# 1. Open: http://localhost:8080/docs
# 2. Find: POST /auth/register
# 3. Click: "Try it out"
# 4. Enter:
{
  "username": "demo_user",
  "password": "demo123"
}
# 5. Click: "Execute"
```

### **4. Login (POST - Use Swagger UI)**
```bash
# 1. In Swagger UI, find: POST /auth/login
# 2. Enter:
{
  "username": "admin",
  "password": "admin123"
}
# 3. Copy the JWT token from response
```

### **5. Products (Requires Authentication)**
```bash
# 1. In Swagger UI, click "Authorize"
# 2. Enter: Bearer YOUR_JWT_TOKEN
# 3. Test: GET /products, POST /products, etc.
```

---

## 🧪 **Automated Testing Scripts**

### **Quick Test**
```bash
cd C:\ims-backend
node scripts/quick-test.js
```

### **Get JWT Token**
```bash
cd C:\ims-backend
node scripts/get-token.js
```

### **Comprehensive Test**
```bash
cd C:\ims-backend
node scripts/test-with-auth.js
```

---

## 📱 **Frontend Testing**

### **1. Access Frontend**
```bash
# Browser: http://localhost:3000
# Expected: Login page
```

### **2. Login to Frontend**
```bash
# Username: admin
# Password: admin123
# Expected: Dashboard with navigation
```

---

## 🔒 **Security Testing**

### **Test 1: Unauthorized Access**
```bash
# Try: GET /products (without token)
# Expected: 401 Unauthorized
```

### **Test 2: Invalid Token**
```bash
# Try: GET /products with "Bearer invalid_token"
# Expected: 401 Unauthorized
```

### **Test 3: Admin vs User Access**
```bash
# Login as regular user, try admin endpoint
# Expected: 403 Forbidden
```

---

## 🎯 **Interview Demo Flow**

### **Phase 1: Backend Demo (5 minutes)**
1. **Show Health Check:** `http://localhost:8080/health`
2. **Show Swagger UI:** `http://localhost:8080/docs`
3. **Register User:** Use Swagger UI
4. **Login & Get Token:** Use Swagger UI
5. **Test Products:** With authentication

### **Phase 2: Advanced Features (5 minutes)**
1. **Admin Dashboard:** `GET /admin/dashboard`
2. **User Management:** `GET /admin/users`
3. **Analytics:** `GET /analytics/products`
4. **Security:** Show unauthorized access blocked

### **Phase 3: Frontend Demo (3 minutes)**
1. **Show Login:** `http://localhost:3000`
2. **Login & Navigate:** Dashboard, Products, Analytics
3. **Show UI/UX:** Modern interface

### **Phase 4: Technical Deep Dive (2 minutes)**
1. **Code Structure:** Explain folders
2. **Database:** Show schema
3. **Security:** JWT implementation
4. **Testing:** Automated scripts

---

## ✅ **Success Checklist**

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Health check working: `http://localhost:8080/health`
- [ ] Swagger UI accessible: `http://localhost:8080/docs`
- [ ] Can register user via Swagger UI
- [ ] Can login and get JWT token
- [ ] Can access products with authentication
- [ ] Can access admin dashboard
- [ ] Can access analytics
- [ ] Frontend login working
- [ ] All automated tests passing

---

## 🚨 **Troubleshooting**

### **Backend Won't Start**
```powershell
# Check if port is in use
netstat -ano | findstr :8080

# Kill process using port 8080
Get-Process -Name "node" | Stop-Process -Force
```

### **Frontend Won't Start**
```powershell
# Check if port is in use
netstat -ano | findstr :3000

# Kill process using port 3000
Get-Process -Name "node" | Stop-Process -Force
```

### **Database Issues**
```powershell
# Delete and recreate database
Remove-Item -Path "ims.db" -Force
npm start
```

---

## 🎉 **You're Ready!**

Your servers are now running:
- ✅ **Backend:** http://localhost:8080
- ✅ **Frontend:** http://localhost:3000
- ✅ **API Docs:** http://localhost:8080/docs
- ✅ **Health Check:** http://localhost:8080/health

**Remember:** Use Swagger UI for POST requests, not your browser! 🚀 