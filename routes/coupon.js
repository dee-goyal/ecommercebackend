const express = require('express');
const router = express.Router();
const Coupon = require('../models/couponmodel');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Import the User model
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendEmailToAllUsers(subject, message) {
  try {
    const users = await User.find({}, 'email');
    for (const user of users) {
      try {
        await transporter.sendMail({
          from: 'pecommerce8@gmail.com',
          to: user.email,
          subject: subject,
          text: message
        });
      } catch (emailError) {
        console.error(`Error sending email to ${user.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error fetching users or sending emails:', error);
  }
}

router.get('/get-coupon', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
});

router.post('/save-coupon', async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;

    const coupon = new Coupon({
      code,
      discountPercentage
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon saved successfully',
      coupon
    });

    const subject = 'New Coupon Available!';
    const message = `A new coupon ${code} is now available with ${discountPercentage}% discount. Use it in your next purchase!`;
    await sendEmailToAllUsers(subject, message);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving coupon',
      error: error.message
    });
  }
});

router.post('/verify-coupon', async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    res.status(200).json({
      success: true,
      discountPercentage: coupon.discountPercentage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying coupon',
      error: error.message
    });
  }
});

router.delete('/delete-coupon', async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;
    const deletedCoupon = await Coupon.findOneAndDelete({ code, discountPercentage });

    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    const subject = 'Coupon Expired';
    const message = `The coupon ${code} with ${discountPercentage}% discount has expired.`;
    await sendEmailToAllUsers(subject, message);

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon',
      error: error.message
    });
  }
});

module.exports = router;
