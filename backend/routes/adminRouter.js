const express=require('express');
const adminRouter=express.Router();
const adminAuthController=require('../controllers/admin/adminAuthController');
const protectAdmin=require('../Middlewares/protectAdmin').protectAdmin;
const adminProductController=require('../controllers/admin/adminProductsController');
const initCloudinary=require('../config/multer-CloudniaryConfig');
const { check } = require('express-validator');

adminRouter.post('/api/admin/login',adminAuthController.adminLogin);

adminRouter.post('/api/admin/signup',adminAuthController.adminSignup);

adminRouter.post('/api/admin/logout',adminAuthController.adminLogout);


(async () => {
  const { upload } = await initCloudinary(); // initialize and wait for upload

adminRouter.post('/upload', upload.single('image'), async (req, res) => {
    res.json({ fileUrl: req.file.path });
  });
})();

adminRouter.get('/api/admin/getProducts/:adminId',protectAdmin,adminProductController.getAdminProducts);

adminRouter.delete('/api/admin/deleteProduct/:productId',protectAdmin,adminProductController.deleteProduct);

(async () => {
  const { upload } = await initCloudinary(); // initialize and wait for upload

  adminRouter.post('/upload', upload.single('image'), async (req, res) => {
    res.json({ fileUrl: req.file.path });
  });
})();

adminRouter.get('/api/admin/dashboard/:adminId',protectAdmin,adminProductController.getAdminProductsAnaytics);

adminRouter.put('/api/admin/orders/deliver/:orderId',protectAdmin,adminProductController.updateOrderStatus);


adminRouter.post('/api/admin/verify-otp', adminAuthController.verifyOtp);


adminRouter.post('/api/admin/resend-otp', 
  [check('email', 'Please include a valid email').isEmail()], 
  adminAuthController.resendOtp
);





module.exports=adminRouter;
