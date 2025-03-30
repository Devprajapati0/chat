import { Router } from "express";
import  {registerUser, verifyCode,googleLogin,failedLogin}  from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import passport from "passport";
const router = Router();


router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));
router.route('/failed').get(failedLogin);
router.route('/google/callback').get(passport.authenticate('google', { session: false, failureRedirect: '/api/v1/user/failed' }),  googleLogin);
router.route("/register").post(upload.single("avatar"),registerUser); 
router.route("/verify-code").post(verifyCode);
export default router; 

