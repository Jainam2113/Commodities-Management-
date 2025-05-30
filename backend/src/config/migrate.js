const { sequelize } = require('./database');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

const migrate = async () => {
    try {
        console.log('🔄 Starting database migration...');

        // Sync database
        await sequelize.sync({ force: true }); // Use force: true only in development
        console.log('✅ Database synced successfully');

        // Create sample users
        console.log('👤 Creating sample users...');

        await User.create({
            email: 'manager@slooze.com',
            password: "password123",
            role: 'manager'
        });

        await User.create({
            email: 'keeper@slooze.com',
            password: "password123",
            role: 'store_keeper'
        });

        console.log('✅ Sample users created');

        // Create sample products
        console.log('📦 Creating sample products...');

        const sampleProducts = [
            {
                name: 'iPhone 12 Pro',
                category: 'Electronics',
                description: 'Latest iPhone model with advanced features',
                price: 1000.00,
                views: 14000,
                revenue: 164000,
                tags: ['electronics', 'smartphone', 'apple', 'mobile'],
                discount: 5,
                status: 'published'
            },
            {
                name: 'MacBook Pro 2023',
                category: 'Electronics',
                description: 'High-performance laptop for professionals',
                price: 1500.00,
                views: 12000,
                revenue: 180000,
                tags: ['electronics', 'laptop', 'apple', 'computer'],
                discount: 0,
                status: 'published'
            },
            {
                name: 'Samsung Galaxy S23',
                category: 'Electronics',
                description: 'Premium Android smartphone',
                price: 800.00,
                views: 9500,
                revenue: 76000,
                tags: ['electronics', 'smartphone', 'samsung', 'android'],
                discount: 10,
                status: 'published'
            },
            {
                name: 'iPad Air',
                category: 'Electronics',
                description: 'Versatile tablet for work and entertainment',
                price: 599.00,
                views: 8200,
                revenue: 49140,
                tags: ['electronics', 'tablet', 'apple', 'ipad'],
                discount: 0,
                status: 'published'
            },
            {
                name: 'Dell XPS 13',
                category: 'Electronics',
                description: 'Ultra-portable laptop with premium build',
                price: 1200.00,
                views: 6800,
                revenue: 81600,
                tags: ['electronics', 'laptop', 'dell', 'ultrabook'],
                discount: 15,
                status: 'draft'
            },
            {
                name: 'AirPods Pro',
                category: 'Electronics',
                description: 'Wireless earbuds with noise cancellation',
                price: 249.00,
                views: 15600,
                revenue: 38844,
                tags: ['electronics', 'audio', 'apple', 'wireless'],
                discount: 0,
                status: 'published'
            },
            {
                name: 'Sony WH-1000XM4',
                category: 'Electronics',
                description: 'Premium noise-canceling headphones',
                price: 350.00,
                views: 7200,
                revenue: 25200,
                tags: ['electronics', 'audio', 'sony', 'headphones'],
                discount: 20,
                status: 'published'
            },
            {
                name: 'Nintendo Switch',
                category: 'Gaming',
                description: 'Hybrid gaming console',
                price: 299.00,
                views: 18900,
                revenue: 56511,
                tags: ['gaming', 'console', 'nintendo', 'portable'],
                discount: 0,
                status: 'published'
            },
            {
                name: 'PlayStation 5',
                category: 'Gaming',
                description: 'Next-generation gaming console',
                price: 499.00,
                views: 22000,
                revenue: 109780,
                tags: ['gaming', 'console', 'playstation', 'sony'],
                discount: 0,
                status: 'published'
            },
            {
                name: 'Microsoft Surface Pro',
                category: 'Electronics',
                description: '2-in-1 tablet and laptop',
                price: 899.00,
                views: 5400,
                revenue: 48546,
                tags: ['electronics', 'tablet', 'microsoft', 'surface'],
                discount: 12,
                status: 'draft'
            }
        ];

        for (const productData of sampleProducts) {
            await Product.create(productData);
        }

        console.log('✅ Sample products created');
        console.log('🎉 Database migration completed successfully!');

        console.log('\n📋 Sample Credentials:');
        console.log('Manager Account: manager@slooze.com / password123');
        console.log('Store Keeper Account: keeper@slooze.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();