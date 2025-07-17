const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Calculate total
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      customer: data.customer,
      items: data.items,
      paymentMethod: data.paymentMethod,
      payment: data.payment || 'Pending',
      status: data.status || 'Order Placed',
      date: data.date,
      total
    });

    const saved = await newOrder.save();
    console.log('✅ Order saved:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Error getting orders:', err);
    res.status(500).json({ message: 'Failed to get orders' });
  }
});

module.exports = router;
