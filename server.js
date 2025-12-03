const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// ========================
// PRODUCTS API
// ========================

// Get all products
app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 79.99, emoji: '🎧', description: 'Premium sound quality' },
        { id: 2, name: 'Smart Watch', price: 199.99, emoji: '⌚', description: 'Track your fitness' },
        { id: 3, name: 'USB-C Cable', price: 14.99, emoji: '🔌', description: 'Fast charging cable' },
        { id: 4, name: 'Portable Charger', price: 34.99, emoji: '🔋', description: '20000mAh capacity' },
        { id: 5, name: 'Phone Stand', price: 24.99, emoji: '📱', description: 'Adjustable holder' },
        { id: 6, name: 'Screen Protector', price: 9.99, emoji: '🛡️', description: 'Tempered glass' },
    ];
    res.json(products);
});
