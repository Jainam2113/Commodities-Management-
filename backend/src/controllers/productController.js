const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Product = require('../models/Product');

const productController = {
    // Get all products with pagination and filters
    getAllProducts: async (req, res) => {
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
                where.name = { [Op.iLike]: `%${search}%` };
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
            console.error('Get products error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get single product
    getProduct: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Increment views
            await product.increment('views');

            res.json(product);
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Create product
    createProduct: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Update product
    updateProduct: async (req, res) => {
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
            console.error('Update product error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Delete product
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await product.destroy();
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const totalProducts = await Product.count();
            const totalEarning = await Product.sum('revenue') || 0;
            const totalViews = await Product.sum('views') || 0;
            const totalSales = await Product.count({
                where: { status: 'published' }
            });

            // Get recent sales (latest updated products)
            const recentSales = await Product.findAll({
                limit: 6,
                order: [['updatedAt', 'DESC']],
                attributes: ['id', 'name', 'price', 'updatedAt']
            });

            // Mock chart data - in real app, this would be from actual sales data
            const chartData = {
                monthly: [
                    { name: 'Jan', value: 1500 },
                    { name: 'Feb', value: 1000 },
                    { name: 'Mar', value: 800 },
                    { name: 'Apr', value: 4500 },
                    { name: 'May', value: 2800 },
                    { name: 'Jun', value: 4000 },
                    { name: 'Jul', value: 4200 },
                    { name: 'Aug', value: 600 },
                    { name: 'Sep', value: 3000 },
                    { name: 'Oct', value: 1200 },
                    { name: 'Nov', value: 2800 },
                    { name: 'Dec', value: 3200 }
                ],
                weekly: [
                    { name: 'Mo', value: 300 },
                    { name: 'Tu', value: 200 },
                    { name: 'We', value: 350 },
                    { name: 'Th', value: 480 },
                    { name: 'Fr', value: 400 },
                    { name: 'Sa', value: 450 },
                    { name: 'Su', value: 320 }
                ]
            };

            res.json({
                stats: {
                    totalEarning: parseFloat(totalEarning).toFixed(2),
                    totalViews,
                    totalSales,
                    subscriptions: 112893 // Mock data for demo
                },
                recentSales: recentSales.map(product => ({
                    id: product.id,
                    customerName: 'Indra Maulana', // Mock customer name
                    email: 'indramaulana@gmail.com', // Mock email
                    amount: `+$${product.price}`,
                    date: product.updatedAt
                })),
                chartData
            });
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = productController;
