const express = require('express');
const UserRouter = express.Router();
const userController = require('../controllers/user/userController');
const { loginValidator, signupValidator } = require('../validators/authValidator');
const  protectUser  = require('../Middlewares/protectUser');

// Remove /api prefix if you're using app.use('/api', UserRouter) in your main app.js
UserRouter.post('/api/signup', signupValidator,userController.registerUser);
UserRouter.post('/api/login', loginValidator,userController.loginUser);
UserRouter.post('/api/logout', userController.logoutUser);

module.exports = UserRouter;