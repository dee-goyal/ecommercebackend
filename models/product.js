const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  images: [String], // Allow multiple image URLs
  category: String,
  rating: Number,
  productId: { type: String, unique: true },
  inStockValue: Number,
  soldStockValue: Number,
  visibility: { type: String, default: 'on' }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
