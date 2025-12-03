const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 79.99, emoji: 'headphones', description: 'Premium sound quality' },
        { id: 2, name: 'Smart Watch', price: 199.99, emoji: 'watch', description: 'Track your fitness' },
        { id: 3, name: 'USB-C Cable', price: 14.99, emoji: 'cable', description: 'Fast charging cable' },
        { id: 4, name: 'Portable Charger', price: 34.99, emoji: 'battery', description: '20000mAh capacity' },
        { id: 5, name: 'Phone Stand', price: 24.99, emoji: 'stand', description: 'Adjustable holder' },
        { id: 6, name: 'Screen Protector', price: 9.99, emoji: 'shield', description: 'Tempered glass' }
    ];
    res.json(products);
});

app.post('/api/payment/initialize', (req, res) => {
    try {
        const { email, amount, currency = 'USD', metadata } = req.body;
        if (!email || !amount) {
            return res.status(400).json({ error: 'Email and amount are required' });
        }
        res.json({
            status: 'success',
            reference: `ref_${Date.now()}`,
            amount: amount,
            currency: currency,
            email: email
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

app.post('/api/payment/verify', (req, res) => {
    try {
        const { reference } = req.body;
        if (!reference) {
            return res.status(400).json({ error: 'Reference is required' });
        }
        res.json({
            status: 'success',
            message: 'Payment verified',
            reference: reference
        });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const { email, items, shippingAddress } = req.body;
        if (!email || !items || items.length === 0) {
            return res.status(400).json({ error: 'Email and items required' });
        }
        const orderId = `ord_${Date.now()}`;
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        res.json({
            status: 'success',
            order: { orderId, email, items, totalAmount, status: 'pending' }
        });
    } catch (error) {
        res.status(500).json({ error: 'Order creation failed' });
    }
});

app.get('/api/orders/:orderId', (req, res) => {
    res.json({
        orderId: req.params.orderId,
        status: 'completed',
        totalAmount: 150.00
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
