const express = require("express");
const router = express.Router();
const { createOrder, handlePaymentSuccess } = require("../controllers/paymentController");
const admin = require("firebase-admin");

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Initialize Firestore

// Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    if (!req.body.amount || !req.body.currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderData = await createOrder(req.body);
    console.log('Order created successfully:', orderData);

    // Store order data in Firestore
    await db.collection("orders").doc(orderData.id).set({
      ...orderData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      data: orderData
    });
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Route to handle payment success
router.post("/success", async (req, res) => {
  try {
    console.log('Received success request:', req.body);

    if (!req.body.orderId || !req.body.paymentStatus) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ['orderId', 'paymentStatus'],
        received: req.body  
      });
    }

    // Update Firestore order status
    const orderRef = db.collection("orders").doc(req.body.orderId);
    await orderRef.update({
      status: req.body.paymentStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      data: { orderId: req.body.orderId, status: req.body.paymentStatus }
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
