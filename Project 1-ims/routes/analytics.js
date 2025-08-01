const express = require('express');
const router = express.Router();
const { getRow, getAll, logProductAnalytics } = require('../db');
const { authenticate } = require('../middleware/auth');
const { optionalAdmin } = require('../middleware/admin');

/**
 * @swagger
 * /analytics/products:
 *   get:
 *     summary: Get product analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Product analytics data
 *       401:
 *         description: Unauthorized
 */
router.get('/products', authenticate, optionalAdmin, async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;

    // Get product analytics
    const [
      mostViewedProducts,
      mostAddedProducts,
      lowStockProducts,
      productTypeDistribution
    ] = await Promise.all([
      // Most viewed products
      getAll(`
        SELECT p.name, p.sku, COUNT(pa.id) as view_count
        FROM products p
        LEFT JOIN product_analytics pa ON p.id = pa.product_id 
        WHERE pa.action_type = 'view' 
        AND pa.timestamp >= datetime('now', '-${days} days')
        GROUP BY p.id
        ORDER BY view_count DESC
        LIMIT 10
      `),
      // Most added products
      getAll(`
        SELECT p.name, p.sku, COUNT(pa.id) as add_count
        FROM products p
        LEFT JOIN product_analytics pa ON p.id = pa.product_id 
        WHERE pa.action_type = 'add' 
        AND pa.timestamp >= datetime('now', '-${days} days')
        GROUP BY p.id
        ORDER BY add_count DESC
        LIMIT 10
      `),
      // Low stock products
      getAll(`
        SELECT name, sku, quantity, min_stock_level
        FROM products
        WHERE quantity <= min_stock_level
        ORDER BY quantity ASC
        LIMIT 10
      `),
      // Product type distribution
      getAll(`
        SELECT type, COUNT(*) as count
        FROM products
        WHERE type IS NOT NULL
        GROUP BY type
        ORDER BY count DESC
      `)
    ]);

    res.json({
      period,
      mostViewedProducts,
      mostAddedProducts,
      lowStockProducts,
      productTypeDistribution
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /analytics/inventory:
 *   get:
 *     summary: Get inventory trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory analytics data
 *       401:
 *         description: Unauthorized
 */
router.get('/inventory', authenticate, optionalAdmin, async (req, res) => {
  try {
    // Get inventory analytics
    const [
      totalValue,
      averagePrice,
      stockLevels,
      recentUpdates
    ] = await Promise.all([
      // Total inventory value
      getRow(`
        SELECT SUM(quantity * price) as total_value
        FROM products
        WHERE quantity > 0
      `),
      // Average product price
      getRow(`
        SELECT AVG(price) as avg_price
        FROM products
      `),
      // Stock level distribution
      getAll(`
        SELECT 
          CASE 
            WHEN quantity = 0 THEN 'Out of Stock'
            WHEN quantity <= min_stock_level THEN 'Low Stock'
            WHEN quantity <= 50 THEN 'Medium Stock'
            ELSE 'High Stock'
          END as stock_level,
          COUNT(*) as count
        FROM products
        GROUP BY stock_level
      `),
      // Recent quantity updates
      getAll(`
        SELECT p.name, p.sku, p.quantity, p.updated_at
        FROM products p
        WHERE p.updated_at >= datetime('now', '-7 days')
        ORDER BY p.updated_at DESC
        LIMIT 10
      `)
    ]);

    res.json({
      totalValue: totalValue.total_value || 0,
      averagePrice: averagePrice.avg_price || 0,
      stockLevels,
      recentUpdates
    });
  } catch (error) {
    console.error('Inventory analytics error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /analytics/users:
 *   get:
 *     summary: Get user activity analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics data
 *       401:
 *         description: Unauthorized
 */
router.get('/users', authenticate, optionalAdmin, async (req, res) => {
  try {
    // Get user analytics
    const [
      totalUsers,
      activeUsers,
      recentLogins,
      userRoles
    ] = await Promise.all([
      // Total users
      getRow('SELECT COUNT(*) as count FROM users'),
      // Active users (logged in last 30 days)
      getRow(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE last_login >= datetime('now', '-30 days')
      `),
      // Recent logins
      getAll(`
        SELECT username, last_login
        FROM users
        WHERE last_login IS NOT NULL
        ORDER BY last_login DESC
        LIMIT 10
      `),
      // User roles distribution
      getAll(`
        SELECT role, COUNT(*) as count
        FROM users
        GROUP BY role
      `)
    ]);

    res.json({
      totalUsers: totalUsers.count,
      activeUsers: activeUsers.count,
      recentLogins,
      userRoles
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /analytics/reports:
 *   get:
 *     summary: Generate custom reports
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [inventory, products, users]
 *         required: true
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *     responses:
 *       200:
 *         description: Report data
 *       401:
 *         description: Unauthorized
 */
router.get('/reports', authenticate, optionalAdmin, async (req, res) => {
  try {
    const { type, format = 'json' } = req.query;

    let reportData;
    let reportName;

    switch (type) {
      case 'inventory':
        reportData = await getAll(`
          SELECT 
            name, sku, type, quantity, price, 
            (quantity * price) as total_value,
            CASE 
              WHEN quantity = 0 THEN 'Out of Stock'
              WHEN quantity <= min_stock_level THEN 'Low Stock'
              ELSE 'In Stock'
            END as stock_status
          FROM products
          ORDER BY quantity ASC
        `);
        reportName = 'Inventory Report';
        break;

      case 'products':
        reportData = await getAll(`
          SELECT 
            name, sku, type, quantity, price,
            created_at, updated_at
          FROM products
          ORDER BY created_at DESC
        `);
        reportName = 'Products Report';
        break;

      case 'users':
        reportData = await getAll(`
          SELECT 
            username, email, role, is_active,
            last_login, created_at
          FROM users
          ORDER BY created_at DESC
        `);
        reportName = 'Users Report';
        break;

      default:
        return res.status(400).json({ 
          message: 'Invalid report type' 
        });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const headers = Object.keys(reportData[0] || {}).join(',');
      const csvData = reportData.map(row => 
        Object.values(row).map(value => `"${value}"`).join(',')
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportName}.csv"`);
      return res.send(`${headers}\n${csvData}`);
    }

    res.json({
      reportName,
      generatedAt: new Date().toISOString(),
      data: reportData
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = router; 