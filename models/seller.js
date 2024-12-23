const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Product = require('./product'); // Assuming the Product model is in the same directory

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  sellerId: { type: String, unique: true, required: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  phoneNumber: { type: String, required: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessType: { type: String, required: true },
  otp: { type: String },
  loggedIn: { type: String, enum: ['loggedin', 'loggedout'], default: 'loggedout' },
  role: { type: String, enum: ['seller', 'owner'], required: true, default: 'seller' }
});

// Hash password before saving
SellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Send Verification Email
SellerSchema.methods.sendVerificationEmail = async function () {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  

  const verificationLink = `http://yourdomain.com/verify-email/${this.sellerId}`;
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: this.email,
    subject: 'Email Verification',
    text: `Click the link to verify your email: ${verificationLink}`
  };

  await transporter.sendMail(mailOptions);
};

// Add a product
// Add a product
SellerSchema.methods.addProduct = async function (productData) {
  const product = new Product({ ...productData, sellerId: this._id });
  await product.save();
  return product;
};

// Remove a product
SellerSchema.methods.removeProduct = async function (productId) {
  const product = await Product.findOneAndDelete({ _id: productId, sellerId: this._id });
  if (!product) throw new Error('Product not found or not authorized');
  return product;
};

const Seller = mongoose.model('Seller', SellerSchema);

module.exports = Seller;
