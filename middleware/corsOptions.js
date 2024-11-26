// middleware/corsOptions.js
const corsOptions = {
  origin: true, // or specify your frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;