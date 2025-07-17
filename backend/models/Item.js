const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  category: String
});
module.exports = mongoose.model('Item', itemSchema);