const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
const createOrder = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, // Convert to smallest currency unit
      currency: currency || "INR",
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Handle payment success
const handlePaymentSuccess = async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  try {
    // Update order status in the database (mocked here)
    console.log(`Updating order ${orderId} to status: ${paymentStatus}`);

    if (paymentStatus === "success") {
      res.status(200).send({ message: "Payment successful, order updated." });
    } else {
      res.status(400).send({ message: "Payment failed." });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Error updating payment status" });
  }
};

module.exports = {
  createOrder,
  handlePaymentSuccess,
};
