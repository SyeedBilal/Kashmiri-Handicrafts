# Full-Stack E-commerce App

A complete full-stack e-commerce application built with **React, Redux, Express, MongoDB, Nodemailer, Cloudinary**, and **Razorpay**.

---

## 📁 Project Structure

### ── `/backend`

#### 📄 Main Files
- `app.js` – Express server entry point with middleware configuration, CORS setup, and route registration.
- `package.json` – Lists all backend dependencies including:
  - `express`, `mongoose`, `bcrypt`, `nodemailer`, `cloudinary`, `multer`, `razorpay`, `connect-mongo`, `dotenv`, etc.

---

#### 📁 Config

- `config/db.js` – MongoDB connection using Mongoose.
- `config/sessions.js` – MongoDB session storage configuration.
- `config/paymentConfig.js` – Razorpay payment gateway integration.
- `config/multer-CloudniaryConfig.js` – File upload handling with Cloudinary storage via multer.

---

#### 📁 Models

- `models/userModel.js` – User schema (name, email, password, OTP fields).
- `models/adminModel.js` – Admin schema (name, email, password, role).
- `models/productModel.js` – Product schema (admin reference, name, description, price, images).
- `models/cartModel.js` – Cart schema (userId, productId, quantity).
- `models/bookings.js` – Order schema (items, shipping address, payment, status).

---

#### 📁 Controllers

- `controllers/user/userController.js` – User sign-up, OTP verification, login, logout.
- `controllers/admin/adminAuthController.js` – Admin authentication logic.
- `controllers/admin/adminProductsController.js` – Admin product management & analytics.
- `controllers/productsController.js` – General product listing and search.
- `controllers/cartController.js` – Add/remove/update cart items.
- `controllers/ordersController.js` – Order creation, Razorpay payment verification.

---

#### 📁 Routes

- `routes/userRouter.js` – `/signup`, `/verify-otp`, `/login`
- `routes/adminRouter.js` – `/admin/login`, `/admin/products`, etc.
- `routes/productsRouter.js` – `/products`, `/products/search`
- `routes/cartRouter.js` – `/cart-items`, `/add-to-cart`, `/cart/remove`
- `routes/orderRouter.js` – `/orders/create`, `/orders/verify-payment`

---

#### 📁 Middlewares

- `Middlewares/protectUser.js` – User authentication protection middleware.
- `Middlewares/protectAdmin.js` – Admin authentication protection middleware.
- `Middlewares/rateLimiter.js` – Rate limiting for APIs to avoid abuse.

---

#### 📁 Utils

- `utils/nodemailer.js` – Send OTP emails using Nodemailer.
- `utils/pathutils.js` – File path utility helpers.

---

### ── `/frontend`

#### 📄 Main Files
- `index.html` – Main HTML template with Razorpay script.
- `src/main.jsx` – React entry point.
- `src/App.jsx` – React router setup including protected routes.

---

#### 📁 Components

- `components/common/Header.jsx` – Top navigation with logo, cart, and login/logout.
- `components/common/Footer.jsx` – Footer with company/contact details.
- `components/cart/CartSummary.jsx` – Cart total calculation and display UI.

---

#### 📁 Pages

- `pages/Login.jsx` – User login form.
- `pages/Signup.jsx` – User signup form with OTP verification.
- `pages/OtpVerification.jsx` – OTP entry and verification.
- `pages/Collections.jsx` – Categorized product displays.
- `pages/ProductsDetail.jsx` – Product detail view with "Add to Cart".
- `pages/Cart.jsx` – Shopping cart with remove/checkout.
- `pages/OrderSuccess.jsx` – Success page after successful order/payment.
- `pages/UserOrders.jsx` – User's order history.

---

#### 📁 Admin Section

- `Admin/AdminLogin.jsx` – Admin login.
- `Admin/AdminDashboard.jsx` – Dashboard with analytics/charts/orders.
- `Admin/AdminProducts.jsx` – Admin view of all products with pagination.
- `Admin/ProductsManagement.jsx` – Add/edit product form with image upload.
- `Admin/AdminEditProduct.jsx` – Edit product details.

---

#### 📁 Redux Store

- `store/store.js` – Redux setup and configuration with redux-persist.
- `store/Slices/authSlice.js` – Manages user auth state.
- `store/Slices/adminSlice.js` – Admin auth state.
- `store/Slices/cartSlice.js` – Cart item and quantity state.
- `store/Slices/itemsSlice.js` – Product list state.
- `store/Slices/adminItemsSlice.js` – Admin product state.
- `store/Slices/orderSlice.js` – Order state.
- `store/Actions/cartAction.js` – Async cart CRUD operations.

---

#### 📁 Services

- `services/axiosInstance.js` – Configured Axios client with interceptors.
- `services/persistantConfig.js` – Redux-persist configuration.

---

## ✅ Tech Stack

- **Frontend:** React.js, Redux, Axios, Razorpay
- **Backend:** Express.js, MongoDB, Mongoose, Nodemailer
- **Authentication:** Sessions with MongoStore
- **Payments:** Razorpay Payment Gateway
- **File Uploads:** Multer + Cloudinary
- **Security:** bcrypt for hashing, express-rate-limit, dotenv, 

---

## 📦 Setup Instructions

1. **Install Backend Dependencies:**

   ```bash
   cd backend
   npm install

   Install Frontend Dependencies:

2.bash
cd frontend
npm install

Environment Setup

3.# Backend .env
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

4.Run Backend:
cd backend
nodemon app.js

5.Run Frontend:
cd frontend
npm run dev

👨‍💻 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change

📧 Contact
Email:syeedbilalkirmaney@gmail.com


