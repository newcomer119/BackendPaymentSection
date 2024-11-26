const express = require("express");
const {
  createOrder,
  handlePaymentSuccess,
} = require("../controllers/paymentController");

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", createOrder);

// Route to handle payment success
router.post("/success", handlePaymentSuccess);

module.exports = router;
