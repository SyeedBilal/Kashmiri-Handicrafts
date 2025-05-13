const express = require('express');
const UserRouter = express.Router();
const userController = require('../controllers/user/userController');
const { loginValidator, signupValidator } = require('../validators/authValidator');
const  protectUser  = require('../Middlewares/protectUser');
const { check } = require('express-validator');

// Remove /api prefix if you're using app.use('/api', UserRouter) in your main app.js
UserRouter.post('/api/signup', signupValidator,userController.registerUser);
UserRouter.post('/api/verify-otp', userController.verifyOtp);
UserRouter.post('/api/login', loginValidator,userController.loginUser);
UserRouter.post('/api/logout', userController.logoutUser);

UserRouter.post('/resend-otp', 
  [check('email', 'Please include a valid email').isEmail()], 
  userController.resendOtp
);

module.exports = UserRouter;