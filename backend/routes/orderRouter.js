const express = require("express");
const { protectUser } = require("../Middlewares/protectUser");
const orderController = require("../controllers/ordersController");
const orderRouter = express.Router();

orderRouter.post('/api/orders/create', protectUser, orderController.createOrder);
orderRouter.post('/api/orders/verify-payment', protectUser, orderController.verifyPayment);
orderRouter.get('/api/orders/user/:userId', protectUser, orderController.getUserOrders);

module.exports = orderRouter;