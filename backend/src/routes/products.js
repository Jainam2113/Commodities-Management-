const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all products with pagination, search, and filters
router.get('/', auth, [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('category').optional().isString(),
    query('status').optional().isIn(['published', 'draft'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { search, category, status } = req.query;

        const where = {};

        if (search) {
            where.name = { [require('sequelize').Op.iLike]: `%${search}%` };
        }

        if (category) {
            where.category = category;
        }

        if (status) {
            where.status = status;
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            products,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Increment views
        await product.increment('views');

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create product
router.post('/', auth, [
    body('name').notEmpty().trim(),
    body('price').isNumeric().isFloat({ min: 0 }),
    body('category').optional().isString(),
    body('description').optional().isString(),
    body('tags').optional().isArray(),
    body('discount').optional().isNumeric().isFloat({ min: 0, max: 100 }),
    body('status').optional().isIn(['published', 'draft'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product
router.put('/:id', auth, [
    body('name').optional().notEmpty().trim(),
    body('price').optional().isNumeric().isFloat({ min: 0 }),
    body('category').optional().isString(),
    body('description').optional().isString(),
    body('tags').optional().isArray(),
    body('discount').optional().isNumeric().isFloat({ min: 0, max: 100 }),
    body('status').optional().isIn(['published', 'draft'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete product
router.delete('/:id', auth, requireRole(['manager']), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get dashboard stats (managers only)
router.get('/stats/dashboard', auth, requireRole(['manager']), async (req, res) => {
    try {
        const totalProducts = await Product.count();
        const totalEarning = await Product.sum('revenue') || 0;
        const totalViews = await Product.sum('views') || 0;
        const totalSales = await Product.count({
            where: { status: 'published' }
        });

        // Recent sales (mock data for demo)
        const recentSales = await Product.findAll({
            limit: 6,
            order: [['updatedAt', 'DESC']],
            attributes: ['id', 'name', 'price', 'updatedAt']
        });

        res.json({
            stats: {
                totalEarning: parseFloat(totalEarning).toFixed(2),
                totalViews,
                totalSales,
                subscriptions: 112893 // Mock data
            },
            recentSales: recentSales.map(product => ({
                id: product.id,
                customerName: 'Indra Maulana', // Mock data
                email: 'indramaulana@gmail.com', // Mock data
                amount: `+$${product.price}`,
                date: product.updatedAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;