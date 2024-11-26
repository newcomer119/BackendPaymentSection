const express = require("express");
const router = express.Router();
const { createOrder, handlePaymentSuccess } = require("../controllers/paymentController");

// Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    console.log('Received request body:', req.body);  // Add this
    
    if (!req.body.amount || !req.body.currency) {
      console.log('Missing required fields');  // Add this
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const orderData = await createOrder(req.body);
    console.log('Order created successfully:', orderData);  // Add this

    // Set explicit headers
    res.setHeader('Content-Type', 'application/json');
    
    // Send response with explicit JSON stringify
    return res.status(200).send(JSON.stringify({
      success: true,
      data: orderData
    }));

  } catch (error) {
    console.error('Route error:', error);  // Add this
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
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