import { Router } from "express";
import  {registerUser, verifyCode,googleLogin,failedLogin,loginUser, usernameUnique, forgotPassword, resendEmail, getProfileDetails, logoutUser,updateProfileDetails,changePassword}  from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import passport from "passport";
import authenticator from "../middleware/jwt.middleware.js";
const router = Router();


router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));
router.route('/login').post(loginUser);
router.route('/failed').get(failedLogin);
router.route('/google/callback').get(passport.authenticate('google', { session: false, failureRedirect: '/api/v1/user/failed' }),  googleLogin);
router.route("/register").post(upload.single("avatar"),registerUser); 
router.route("/verify-code").post(verifyCode);
router.route("/username").get(usernameUnique);
router.route('/forgot-password').put(forgotPassword);
router.route('/resend-email').post(resendEmail);

router.route('/logout').get(authenticator,logoutUser)
router.route('/profile-detail').get(authenticator,getProfileDetails);
router.route('/update-profile').put(authenticator,upload.single("avatar"),updateProfileDetails);
router.route('/change-password').put(authenticator,changePassword);
 
export default router;

