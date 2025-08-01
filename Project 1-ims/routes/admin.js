const express = require('express');
const router = express.Router();
const { runQuery, getRow, getAll, logActivity } = require('../db');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *                 lowStockProducts:
 *                   type: integer
 *                 recentActivity:
 *                   type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    // Get dashboard statistics
    const [
      totalUsers,
      totalProducts,
      lowStockProducts,
      recentActivity
    ] = await Promise.all([
      getRow('SELECT COUNT(*) as count FROM users'),
      getRow('SELECT COUNT(*) as count FROM products'),
      getRow('SELECT COUNT(*) as count FROM products WHERE quantity <= min_stock_level'),
      getAll(`
        SELECT al.*, u.username 
        FROM activity_logs al 
        LEFT JOIN users u ON al.user_id = u.id 
        ORDER BY al.timestamp DESC 
        LIMIT 10
      `)
    ]);

    res.json({
      totalUsers: totalUsers.count,
      totalProducts: totalProducts.count,
      lowStockProducts: lowStockProducts.count,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const offset = (page - 1) * perPage;

    const [users, totalCount] = await Promise.all([
      getAll(`
        SELECT id, username, email, role, is_active, last_login, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `, [perPage, offset]),
      getRow('SELECT COUNT(*) as count FROM users')
    ]);

    res.json({
      users,
      pagination: {
        page,
        per_page: perPage,
        total: totalCount.count,
        total_pages: Math.ceil(totalCount.count / perPage)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update user role/status (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.put('/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role, is_active } = req.body;

    // Check if user exists
    const user = await getRow('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Update user
    const updateFields = [];
    const updateValues = [];
    
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        message: 'No fields to update' 
      });
    }

    updateValues.push(userId);
    await runQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    // Log activity
    await logActivity(req.user.id, 'UPDATE_USER', `Updated user ${userId}`, req.ip, req.get('User-Agent'));

    res.json({ 
      message: 'User updated successfully' 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get system analytics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/analytics', authenticate, requireAdmin, async (req, res) => {
  try {
    // Get various analytics
    const [
      topProducts,
      userActivity,
      productTypes,
      recentLogins
    ] = await Promise.all([
      // Most viewed products
      getAll(`
        SELECT p.name, p.sku, COUNT(pa.id) as view_count
        FROM products p
        LEFT JOIN product_analytics pa ON p.id = pa.product_id AND pa.action_type = 'view'
        GROUP BY p.id
        ORDER BY view_count DESC
        LIMIT 10
      `),
      // User activity by day
      getAll(`
        SELECT DATE(timestamp) as date, COUNT(*) as activity_count
        FROM activity_logs
        WHERE timestamp >= datetime('now', '-30 days')
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
      `),
      // Products by type
      getAll(`
        SELECT type, COUNT(*) as count
        FROM products
        WHERE type IS NOT NULL
        GROUP BY type
        ORDER BY count DESC
      `),
      // Recent logins
      getAll(`
        SELECT username, last_login
        FROM users
        WHERE last_login IS NOT NULL
        ORDER BY last_login DESC
        LIMIT 10
      `)
    ]);

    res.json({
      topProducts,
      userActivity,
      productTypes,
      recentLogins
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: Get system activity logs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Activity logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/logs', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 50;
    const offset = (page - 1) * perPage;

    const [logs, totalCount] = await Promise.all([
      getAll(`
        SELECT al.*, u.username 
        FROM activity_logs al 
        LEFT JOIN users u ON al.user_id = u.id 
        ORDER BY al.timestamp DESC 
        LIMIT ? OFFSET ?
      `, [perPage, offset]),
      getRow('SELECT COUNT(*) as count FROM activity_logs')
    ]);

    res.json({
      logs,
      pagination: {
        page,
        per_page: perPage,
        total: totalCount.count,
        total_pages: Math.ceil(totalCount.count / perPage)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = router; 