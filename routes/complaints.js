const express = require('express');
const nodemailer = require('nodemailer');
const Complaint = require('../models/complaintmodel');  // Import the Complaint model
const router = express.Router();
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

const sendConfirmationEmail = async (email, complaintNumber, message) => {
  try {
    const mailOptions = {
      from: '"Mera Bestie" <pecommerce8@gmail.com>',
      to: email,
      subject: 'Complaint Registration Confirmation',
      html: `HTML Content`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

router.post('/post-complaints', async (req, res) => {
  try {
    const { name, email, message, userType } = req.body;
    const complaintNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const complaintData = { complaintNumber, name, email, message, userType };

    const complaint = new Complaint(complaintData);
    const result = await complaint.save();

    await sendConfirmationEmail(email, complaintNumber, message);
    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      complaint: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering complaint',
      error: error.message
    });
  }
});

router.get('/get-complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json({
      success: true,
      complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
});

router.put('/update-complaint-status', async (req, res) => {
  try {
    const { complaintId, status } = req.body;
    const updatedComplaint = await Complaint.findOneAndUpdate(
      { complaintNumber: complaintId },
      { $set: { status } },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint: updatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating complaint status',
      error: error.message
    });
  }
});

module.exports = router;
