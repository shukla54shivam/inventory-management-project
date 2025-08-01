const express = require('express');
const router = express.Router();
const { runQuery, getRow, getAll } = require('../db');
const { authenticate } = require('../middleware/auth');

// Input validation middleware
const validateProduct = (req, res, next) => {
  const { name, sku, price } = req.body;
  
  if (!name || !sku || price === undefined) {
    return res.status(400).json({ 
      message: 'Name, SKU, and price are required' 
    });
  }
  
  if (name.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Product name cannot be empty' 
    });
  }
  
  if (sku.trim().length === 0) {
    return res.status(400).json({ 
      message: 'SKU cannot be empty' 
    });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ 
      message: 'Price must be a positive number' 
    });
  }
  
  next();
};

const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  
  if (quantity === undefined || quantity === null) {
    return res.status(400).json({ 
      message: 'Quantity is required' 
    });
  }
  
  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ 
      message: 'Quantity must be a non-negative integer' 
    });
  }
  
  next();
};

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by product type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       sku:
 *                         type: string
 *                       image_url:
 *                         type: string
 *                       description:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     per_page:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const type = req.query.type;
    const search = req.query.search;
    
    // Build WHERE clause
    let whereClause = '';
    let params = [];
    
    if (type || search) {
      whereClause = 'WHERE ';
      const conditions = [];
      
      if (type) {
        conditions.push('type = ?');
        params.push(type);
      }
      
      if (search) {
        conditions.push('name LIKE ?');
        params.push(`%${search}%`);
      }
      
      whereClause += conditions.join(' AND ');
    }
    
    // Get total count
    const countResult = await getRow(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countResult.total;
    
    // Calculate pagination
    const offset = (page - 1) * perPage;
    const totalPages = Math.ceil(total / perPage);
    
    // Get products
    const products = await getAll(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );
    
    res.json({
      products,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: totalPages
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               sku:
 *                 type: string
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 0
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product_id:
 *                   type: integer
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Product with SKU already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validateProduct, async (req, res) => {
  try {
    const { name, type, sku, image_url, description, quantity = 0, price } = req.body;
    
    // Check if product with SKU already exists
    const existingProduct = await getRow('SELECT id FROM products WHERE sku = ?', [sku]);
    if (existingProduct) {
      return res.status(409).json({ 
        message: `Product with SKU ${sku} already exists` 
      });
    }
    
    // Insert new product
    const result = await runQuery(
      `INSERT INTO products (name, type, sku, image_url, description, quantity, price) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, type, sku, image_url, description, quantity, price]
    );
    
    res.status(201).json({ 
      message: 'Product added successfully',
      product_id: result.id
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /products/{id}/quantity:
 *   put:
 *     summary: Update product quantity
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 sku:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 description:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 price:
 *                   type: number
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id/quantity', authenticate, validateQuantity, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { quantity } = req.body;
    
    // Check if product exists
    const product = await getRow('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }
    
    // Update quantity
    await runQuery(
      'UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, productId]
    );
    
    // Get updated product
    const updatedProduct = await getRow('SELECT * FROM products WHERE id = ?', [productId]);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 sku:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 description:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 price:
 *                   type: number
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    const product = await getRow('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
