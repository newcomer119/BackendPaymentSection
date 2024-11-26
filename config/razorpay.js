const express = require('express');
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json()); // Ensure this is before your routes

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Your routes will come after the middleware
