const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: Date, required: true }
});

// Validate Coupon
couponSchema.methods.validateCoupon = function (orderAmount) {
  if (new Date() > this.expiryDate) return { valid: false, message: 'Coupon expired' };
  return {
    valid: true,
    discount: (orderAmount * this.discountPercentage) / 100
  };
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
