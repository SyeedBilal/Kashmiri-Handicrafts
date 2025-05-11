const express = require('express');
const CartRouter = express.Router();
const cartController = require('../controllers/cartController');
const {protectUser} = require('../Middlewares/protectUser');

CartRouter.get('/api/cart-items', protectUser, cartController.getCartItems);
CartRouter.post('/api/add-to-cart', protectUser, cartController.addToCart);
CartRouter.post('/api/cart/remove', protectUser, cartController.removeFromCart);

module.exports = CartRouter;