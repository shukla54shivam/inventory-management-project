const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'ims.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
db.serialize(() => {
  // Enhanced Users table with admin features
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Enhanced Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    sku TEXT UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    cost_price REAL,
    min_stock_level INTEGER DEFAULT 10,
    max_stock_level INTEGER,
    supplier TEXT,
    location TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Analytics tables
  db.run(`CREATE TABLE IF NOT EXISTS product_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    action_type TEXT CHECK (action_type IN ('view', 'add', 'update', 'delete')),
    user_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Create indexes for better performance
  db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
  db.run('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
  db.run('CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)');
  db.run('CREATE INDEX IF NOT EXISTS idx_products_type ON products(type)');
  db.run('CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity)');
  db.run('CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by)');
  db.run('CREATE INDEX IF NOT EXISTS idx_product_analytics_product_id ON product_analytics(product_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_product_analytics_timestamp ON product_analytics(timestamp)');
  db.run('CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp)');

  console.log('✅ Database initialized successfully with admin features');
});

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get multiple rows
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Helper function to log activity
async function logActivity(userId, action, details = null, ipAddress = null, userAgent = null) {
  try {
    await runQuery(
      'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId, action, details, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Helper function to log product analytics
async function logProductAnalytics(productId, actionType, userId) {
  try {
    await runQuery(
      'INSERT INTO product_analytics (product_id, action_type, user_id) VALUES (?, ?, ?)',
      [productId, actionType, userId]
    );
  } catch (error) {
    console.error('Error logging product analytics:', error);
  }
}

// Close database connection
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = {
  db,
  runQuery,
  getRow,
  getAll,
  logActivity,
  logProductAnalytics
};