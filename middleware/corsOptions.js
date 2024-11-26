const corsOptions = {
    origin: [
      "http://localhost:3000", // Development frontend URL
      "https://your-frontend-domain.com", // Production frontend URL
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  };
  
  module.exports = corsOptions;
  