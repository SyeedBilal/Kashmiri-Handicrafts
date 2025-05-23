require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser'); 
const connectDB = require("./config/db");
const cors = require("cors");
const productsRouter = require("./routes/productsRouter");
const CartRouter = require("./routes/cartRouter");
const UserRouter = require("./routes/userRouter");
const sessionConfig = require("./config/sessions");
const limiter = require("./Middlewares/rateLimmter");
const adminRouter=require("./routes/adminRouter");
const orderRouter = require("./routes/orderRouter");
const app = express();
const port = 3000;
const path = require('path');




app.set('trust proxy', 1); // trust first proxy (Render, etc.)

app.use(cookieParser()); 

app.use(sessionConfig);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // must be true to allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter); // Apply rate limiting middleware

connectDB();

app.use(productsRouter);
app.use(CartRouter);
app.use(UserRouter); 
app.use(orderRouter)
app.use(adminRouter); 

app.get("/", (req, res) => res.send("Connected to the backend server"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, error: err.message || "Internal Server Error" });
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "catch-all" handler: for any request that doesn't
// match one of the routes above, send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(port, () =>
  console.log(`Backend Server is running on port http://localhost:${port}`)
);

