import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Admin } from "../model.js";

const router = express.Router();
const saltRounds = 10;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'celestino.kreiger25@ethereal.email',
      pass: 'FHmjnrUbJAhERcaYr5'
  }
})

// Create admin and send verification email
router.post("/create", async (req, res) => {
  const { userName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const newAdmin = await Admin.create({ userName, email, password: hashedPassword });

    // Generate a verification token (could be a JWT or any unique string)
    const verificationToken = Math.random().toString(36).substring(2);

    // Send verification email
    const mailOptions = {
      from: 'celestino.kreiger25@ethereal.email',
      to: email,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking the following link: http://localhost:8000/api/admin/verify-email?token=${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    // Save the verification token to the database (this assumes you have a field for it)
    await newAdmin.update({ verificationToken });

    res.json({ message: 'Admin created, please check your email to verify your account' });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

// Verify email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const admin = await Admin.findOne({ where: { verificationToken: token } });

    if (admin) {
      await admin.update({ verificationToken: null });
      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification token' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (admin) {
      if (admin.verificationToken) {
        return res.status(400).json({ error: 'Please verify your email before logging in' });
      }

      const match = await bcrypt.compare(password, admin.password);

      if (match) {
        req.session.adminId = admin.adminId;
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Incorrect password' });
      }
    } else {
      res.json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Other admin routes

export default router;

