const express = require("express");
const router = express.Router();
const { createOrder, handlePaymentSuccess } = require("../controllers/paymentController");

// Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    console.log('Received create-order request:', req.body); // Add logging

    if (!req.body.amount || !req.body.currency) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ['amount', 'currency'],
        received: req.body 
      });
    }

    const orderData = await createOrder(req.body);
    console.log('Order created:', orderData); // Add logging

    return res.status(200).json({
      success: true,
      data: orderData
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error creating order",
      error: error.message 
    });
  }
});

// Route to handle payment success
router.post("/success", async (req, res) => {
  try {
    console.log('Received success request:', req.body); // Add logging

    if (!req.body.orderId || !req.body.paymentStatus) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ['orderId', 'paymentStatus'],
        received: req.body 
      });
    }

    const paymentResult = await handlePaymentSuccess(req.body);
    console.log('Payment processed:', paymentResult); // Add logging

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      data: paymentResult
    });

  } catch (error) {
    console.error("Error handling payment success:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error processing payment success",
      error: error.message 
    });
  }
});

module.exports = router;