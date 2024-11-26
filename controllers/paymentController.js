const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createOrder = async ({ amount, currency }) => {
  try {
    console.log('Creating order with:', { amount, currency });  // Add this
    
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency,
      receipt: crypto.randomBytes(10).toString("hex"),
    });
    
    console.log('Razorpay response:', order);  // Add this
    
    const response = {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "Order created successfully",
    };
    
    console.log('Sending response:', response);  // Add this
    return response;
    
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    // Log the full error details
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw error; // Throw the original error
  }
};

// Handle payment success and update order status
const handlePaymentSuccess = async ({ orderId, paymentStatus }) => {
  try {
    // Logic to update the order status in your database
    if (paymentStatus === "success") {
      // Update the order status in your database here
      return { orderId, paymentStatus: "success", message: "Order updated successfully" };
    } else {
      return { orderId, paymentStatus: "failed", message: "Payment failed" };
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw new Error("Error processing payment success");
  }
};

module.exports = {
  createOrder,
  handlePaymentSuccess,
};