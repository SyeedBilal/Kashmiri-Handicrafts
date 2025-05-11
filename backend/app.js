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




app.use(cookieParser()); 

app.use(sessionConfig);

app.use(cors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization','Cookie','withCredentials'],

  headers:{
    credentials:true,
  }
}));
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

app.listen(port, () =>
  console.log(`Backend Server is running on port http://localhost:${port}`)
);
 
