const loadSecrets = require('./config/awsSecrets');
const express = require("express");
const cookieParser = require('cookie-parser'); 
const connectDB = require("./config/db");
const cors = require("cors");
const productsRouter = require("./routes/productsRouter");
const CartRouter = require("./routes/cartRouter");
const UserRouter = require("./routes/userRouter");
const initSession = require("./config/sessions");
const limiter = require("./Middlewares/rateLimmter");
const adminRouter = require("./routes/adminRouter");
const orderRouter = require("./routes/orderRouter");
const path = require('path');

const port = 3000;

(async () => {
  // 1️⃣ Load AWS Secrets first
  await loadSecrets();

  // 2️⃣ Initialize app and middleware
  const app = express();

  app.set('trust proxy', 1);
  app.use(cookieParser());

  // 3️⃣ Initialize session AFTER secrets are loaded
  const sessionMiddleware = await initSession();
  app.use(sessionMiddleware);

  // 4️⃣ Enable CORS after session
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 5️⃣ JSON parser, rate limiter, routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(limiter);

  await connectDB();

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "Backend is healthy",
      timestamp: new Date(),
    });
  });

  app.use(productsRouter);
  app.use(CartRouter);
  app.use(UserRouter);
  app.use(orderRouter);
  app.use(adminRouter);

  app.get("/", (req, res) => res.send("Connected to the backend server"));

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  });

  // 6️⃣ Start server
  app.listen(port, () =>
    console.log(`✅ Backend Server is running on http://localhost:${port}`)
  );
})();
