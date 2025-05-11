const express = require('express');

const productsRouter = express.Router();
const ProductsController = require("../controllers/productsController");

productsRouter.get('/api/products', ProductsController.getProducts);

productsRouter.get('/api/products/search', ProductsController.getProductsBySearch);



module.exports = productsRouter;