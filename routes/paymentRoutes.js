const express = require("express");
const {
  createOrder,
  handlePaymentSuccess,
} = require("../controllers/paymentController");

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const orderData = await createOrder(req.body);
    if (orderData) {
      res.status(200).json(orderData); // Send order data in the response
    } else {
      res.status(500).json({ message: "Error creating order" });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

// Route to handle payment success
router.post("/success", async (req, res) => {
  try {
    const paymentResult = await handlePaymentSuccess(req.body);
    if (paymentResult) {
      res.status(200).json({ message: "Payment successful", data: paymentResult });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ message: "Error processing payment success" });
  }
});

module.exports = router;
