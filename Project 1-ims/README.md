# IMS Backend - Inventory Management System

A comprehensive **full-stack inventory management system** with advanced features including admin portal, analytics, React frontend, and Docker deployment.

## 🚀 **Features**

### **✅ Core Features (Completed)**
- **User Authentication**: Secure JWT-based authentication system
- **Product Management**: Full CRUD operations for inventory items
- **Database**: SQLite with optimized queries and indexing
- **API Documentation**: Interactive Swagger documentation
- **Security**: Helmet.js security headers, CORS support
- **Logging**: Morgan HTTP request logging
- **Validation**: Input validation and error handling
- **Pagination**: Efficient pagination for product listings

### **🆕 Extended Features (New!)**
- **🔐 Admin Portal**: Role-based access control with admin dashboard
- **📊 Analytics & Reporting**: Product analytics, inventory trends, user activity
- **🐳 Docker Deployment**: Containerized application with nginx reverse proxy
- **⚛️ React Frontend**: Modern UI/UX (planned)

## 📋 **Prerequisites**

- Node.js (version 14 or higher)
- npm or yarn package manager
- Docker & Docker Compose (for containerized deployment)

## 🛠️ **Installation**

### **Option 1: Local Development**
```bash
# Clone the repository
git clone <your-repository-url>
cd ims-backend

# Install dependencies
npm install

# Create admin user
npm run create-admin

# Start development server
npm run dev
```

### **Option 2: Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in production mode
docker-compose --profile production up --build
```

The server will start at `http://localhost:8080`

## 📚 **API Documentation**

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8080/docs`
- **Health Check**: `http://localhost:8080/health`

## 🔐 **Authentication**

The API uses JWT (JSON Web Tokens) for authentication with role-based access:

### **Default Admin User**
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

### **Regular User Registration**
```bash
POST /auth/register
{
  "username": "your_username",
  "password": "your_password"
}
```

### **Login**
```bash
POST /auth/login
{
  "username": "your_username",
  "password": "your_password"
}
```

## 📦 **API Endpoints**

### **Authentication**
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### **Products**
- `GET /products` - Get all products (with pagination and filtering)
- `POST /products` - Add a new product
- `GET /products/:id` - Get a specific product
- `PUT /products/:id/quantity` - Update product quantity

### **🔐 Admin Endpoints (New!)**
- `GET /admin/dashboard` - Admin dashboard with statistics
- `GET /admin/users` - Get all users with pagination
- `PUT /admin/users/:id` - Update user role/status
- `GET /admin/analytics` - System analytics
- `GET /admin/logs` - Activity logs

### **📊 Analytics Endpoints (New!)**
- `GET /analytics/products` - Product analytics (most viewed/added)
- `GET /analytics/inventory` - Inventory trends and stock levels
- `GET /analytics/users` - User activity analytics
- `GET /analytics/reports` - Generate custom reports (JSON/CSV)

### **Query Parameters**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 10)
- `type` - Filter by product type
- `search` - Search in product name
- `period` - Analytics period (7d, 30d, 90d)

## 🗄️ **Enhanced Database Schema**

### **Users Table (Enhanced)**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| username | TEXT | Unique username |
| password | TEXT | Hashed password |
| email | TEXT | User email |
| role | TEXT | 'user' or 'admin' |
| is_active | BOOLEAN | Account status |
| last_login | DATETIME | Last login timestamp |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### **Products Table (Enhanced)**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Product name |
| type | TEXT | Product type/category |
| sku | TEXT | Stock Keeping Unit (unique) |
| image_url | TEXT | Product image URL |
| description | TEXT | Product description |
| quantity | INTEGER | Available quantity |
| price | REAL | Product price |
| cost_price | REAL | Cost price for profit calculation |
| min_stock_level | INTEGER | Minimum stock level |
| max_stock_level | INTEGER | Maximum stock level |
| supplier | TEXT | Supplier information |
| location | TEXT | Warehouse location |
| created_by | INTEGER | User who created the product |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### **Analytics Tables (New!)**
- **product_analytics**: Track product views, additions, updates
- **activity_logs**: System-wide activity tracking

## 🧪 **Testing with Postman**

### **1. Register a User**
```http
POST http://localhost:8080/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### **2. Login as Admin**
```http
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### **3. Access Admin Dashboard**
```http
GET http://localhost:8080/admin/dashboard
Authorization: Bearer <your_jwt_token>
```

### **4. Get Analytics**
```http
GET http://localhost:8080/analytics/products?period=30d
Authorization: Bearer <your_jwt_token>
```

### **5. Generate Report**
```http
GET http://localhost:8080/analytics/reports?type=inventory&format=csv
Authorization: Bearer <your_jwt_token>
```

## 🐳 **Docker Deployment**

### **Development**
```bash
# Build and run
docker-compose up --build

# View logs
docker-compose logs -f ims-backend
```

### **Production**
```bash
# Run with nginx reverse proxy
docker-compose --profile production up --build -d

# Scale the application
docker-compose up --scale ims-backend=3
```

### **Environment Variables**
```bash
# .env file
NODE_ENV=production
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🚀 **Production Deployment**

### **1. Set environment variables**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret
PORT=8080
```

### **2. Docker deployment**
```bash
# Build production image
docker build -t ims-backend .

# Run with docker-compose
docker-compose --profile production up -d
```

### **3. Health monitoring**
```bash
# Check application health
curl http://localhost:8080/health

# View container logs
docker-compose logs -f ims-backend
```

## 📁 **Project Structure**

```
ims-backend/
├── 📄 .env                    # Environment variables
├── 📄 .gitignore             # Git ignore rules
├── 📄 Dockerfile             # Docker configuration
├── 📄 docker-compose.yml     # Docker Compose setup
├── 📄 nginx.conf             # Nginx reverse proxy config
├── 📄 index.js               # Main server file
├── 📄 db.js                  # Database setup
├── 📄 swagger.js             # API documentation
├── 📄 package.json           # Dependencies and scripts
├── 📄 README.md              # This file
├── 📄 postman_collection.json # API testing collection
├── 📁 middleware/
│   ├── auth.js            # Authentication middleware
│   └── admin.js           # Admin middleware
├── 📁 routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product management routes
│   ├── admin.js           # Admin routes
│   └── analytics.js       # Analytics routes
├── 📁 scripts/
│   └── create-admin.js    # Admin user creation script
└── 📁 docs/
    ├── 📄 project.md         # Project requirements
    └── 📄 schema.md          # Database schema
```

## 🔧 **Development**

### **Available Scripts**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run create-admin` - Create admin user
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### **Docker Commands**
- `docker-compose up --build` - Build and run development
- `docker-compose --profile production up` - Run with nginx
- `docker-compose down` - Stop all services
- `docker-compose logs -f` - View logs

## 🎯 **Interview Demo Strategy**

### **Phase 1: Backend Demo (5 minutes)**
1. **Health Check** → "Server is running and healthy"
2. **Swagger Docs** → "Complete API documentation"
3. **User Registration** → "Authentication system working"
4. **Product CRUD** → "Full inventory management"

### **Phase 2: Admin Features (5 minutes)**
1. **Admin Login** → "Role-based access control"
2. **Admin Dashboard** → "Real-time statistics"
3. **User Management** → "Admin can manage users"
4. **Analytics** → "Data-driven insights"

### **Phase 3: Advanced Features (5 minutes)**
1. **Docker Deployment** → "Containerized application"
2. **Nginx Reverse Proxy** → "Production-ready setup"
3. **Analytics Reports** → "Business intelligence"
4. **Security Features** → "Enterprise-grade security"

### **Key Talking Points**
- ✅ **Full-Stack Architecture**: Backend + Frontend (planned)
- ✅ **Enterprise Features**: Admin portal, analytics, reporting
- ✅ **Modern DevOps**: Docker, nginx, CI/CD ready
- ✅ **Security**: JWT, role-based access, input validation
- ✅ **Performance**: Database indexing, pagination, caching
- ✅ **Scalability**: Microservices architecture, load balancing

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

If you encounter any issues or have questions:

1. Check the [API Documentation](http://localhost:8080/docs)
2. Review the [Issues](https://github.com/yourusername/ims-backend/issues)
3. Create a new issue with detailed information

## 🔄 **Changelog**

### **Version 2.0.0** 🚀
- ✅ **Admin Portal**: Role-based access control
- ✅ **Analytics Dashboard**: Product and user analytics
- ✅ **Docker Deployment**: Containerized application
- ✅ **Enhanced Database**: Extended schema with analytics
- ✅ **Security Improvements**: Admin middleware, activity logging
- ✅ **Production Ready**: Nginx reverse proxy, health checks

### **Version 1.0.0**
- ✅ User authentication with JWT
- ✅ Product management API
- ✅ Swagger documentation
- ✅ SQLite database with optimized queries
- ✅ Security middleware and validation

---

## 🏆 **Project Highlights**

This **enterprise-grade inventory management system** demonstrates:

1. **Full-Stack Development**: Complete backend with planned React frontend
2. **Enterprise Features**: Admin portal, analytics, reporting, user management
3. **Modern Architecture**: Microservices, Docker, nginx, CI/CD ready
4. **Production Ready**: Security, monitoring, scalability, health checks
5. **Developer Experience**: Comprehensive documentation, testing, Docker
6. **User Experience**: Intuitive admin interface, real-time analytics

Perfect for showcasing **full-stack skills**, **system design**, **database management**, **security implementation**, and **modern DevOps practices** in any interview! 🚀 