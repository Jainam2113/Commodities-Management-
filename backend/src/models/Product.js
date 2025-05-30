const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    category: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 100]
        }
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    revenue: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    imageUrl: {
        type: DataTypes.STRING(500),
        field: 'image_url'
    },
    thumbnailUrl: {
        type: DataTypes.STRING(500),
        field: 'thumbnail_url'
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    discountCategory: {
        type: DataTypes.STRING(100),
        field: 'discount_category'
    },
    status: {
        type: DataTypes.ENUM('published', 'draft'),
        defaultValue: 'published'
    }
});

module.exports = Product;