const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String
  },
  items: [{
    title: String,
    price: Number,
    image: String,
    category: String,
    quantity: Number
  }],
  paymentMethod: String,
  payment: { type: String, default: 'Pending' },
  status: { type: String, default: 'Order Placed' },
  date: String,
  total: Number
});
module.exports = mongoose.model('Order', orderSchema);
