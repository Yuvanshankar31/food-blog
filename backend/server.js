const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tomato')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const itemsRoutes = require('./routes/items');
const ordersRoutes = require('./routes/orders');
app.use('/api/items', itemsRoutes);
app.use('/api/orders', ordersRoutes);

// Test root route
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
