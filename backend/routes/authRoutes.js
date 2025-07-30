import express from "express"
import { login, logout, register, sendVerifyOtp, verifyEmail,isAuthenticated, sendResetOtp, resetUserPassword } from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";


const router=express.Router();


router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
//path middleware handlerfunction
router.post('/send-verify-otp',userAuth,sendVerifyOtp);
router.post('/verify-account',userAuth,verifyEmail);
router.get('/is-Auth',userAuth,isAuthenticated);
router.post('/send-reset-otp',sendResetOtp);
router.post('/reset-password',resetUserPassword);


 


export default router;