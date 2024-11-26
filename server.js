const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/paymentRoutes");
const corsOptions = require("./middleware/corsOptions");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - order is important
app.use(cors(corsOptions));
app.use(express.json()); // Use this instead of bodyParser
app.use(express.urlencoded({ extended: true }));
// Add this right before app.listen()
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Add a test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});
// Routes
app.use("/api/payment", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});