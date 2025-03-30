import apiResponse from "../utils/apiresponse.js";
import {User} from "../models/user.model.js";
import asynhandler from "../utils/asynchandler.js";
import { signupSchema, verifySchema } from "../schema/user.schema.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../helpers/mailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenRefreshToken = async (userId) => {
    try {
      const userExisted = await User.findById(userId);
      if (!userExisted) {
        throw new apiError(400, "User does not exist");
      }
  
      const accessToken = await userExisted.generateAccessToken();
      const refreshToken = await userExisted.generateRefreshToken();
  
      userExisted.refreshToken = refreshToken;
      await userExisted.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("generateAccessTokenRefreshToken::", error);
      throw error;
    }
};

const googleLogin = asynhandler(async (req, res) => {
    try {
      const user = req.user;
      console.log("user google", user);
      if (!user) {
        return res.json(new apiResponse(400, null, "User not found"));
      }
  
      // Generate tokens
      const { accessToken, refreshToken } = await generateAccessTokenRefreshToken(user._id);
  
      // Cookie options
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "Strict",
      };
  
      // Set access & refresh tokens in cookies
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new apiResponse(200, { user, accessToken, refreshToken }, "User logged in successfully")
        );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

const registerUser = asynhandler(async(req,res) => {

const signupData = signupSchema.safeParse( req.body);

if(!signupData.success){
    return res.json(
        new apiResponse(
            400,
          null,
           "Credentials required"
        )
    )} 

   
    /*
    case 1: username exist and verified
    case 2: email exist and verofoed
    case 3: if email exist make it verified 
    case 4: else create one
    */
    try {
        // case 1
        const exisitngUserVerifiedByUsername = await User.findOne({
            username:signupData.data.username,
            isVerified:true
        })
        console.log("exisitngUserVerifiedByUsername",exisitngUserVerifiedByUsername)

        if(exisitngUserVerifiedByUsername){
            return res.json(
                new apiResponse(
                     400,
                     null,
                     "username already exists"
                )
            )
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        // case 2
        const existingEmail = await User.findOne({
            email:signupData.data.email,
        })
        console.log("existingEmail",existingEmail)
        if(existingEmail){
           if(existingEmail.isVerified){
            return res.json(
                new apiResponse(
                     400,
                     null,
                     "user already exist with this email"
                )
            )
           }
           else{
                // case 3
                const hashedPassword = await bcrypt.hash(signupData.data.password,10);
                existingEmail.password = hashedPassword
                existingEmail.verifyCode = verifyCode
                existingEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingEmail.save()
                console.log("existingEmail",existingEmail)
                
           }
        }
        else{
            console.log("mukter fike",req.file)
            const url =await req.file?.path; 
            const fileUpload = await uploadOnCloudinary(url)
            console.log("fileUpload",fileUpload)
            const hashedPassword = await bcrypt.hash(signupData.data.password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() +1) //increase expiry by 1 hour
            const newUser = new User({
                username:signupData.data.username,
                email:signupData.data.email,
                password:hashedPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                avatar:{
                    public_id:fileUpload.public_id,
                    url:fileUpload.url
                }
            })
            await newUser.save()
            console.log("newUser",newUser)
        }

        //email verification
        //send email
        const emailResponse = await sendVerificationEmail(signupData.data.username,signupData.data.email,verifyCode)
          console.log("emialResponse",emailResponse)

        return res.json(
            new apiResponse(
                 201,
                 null,
                 "user registered successfully"
            )
        )
    } catch (error) {
        console.log("error",error)
        return res.json(
            new apiResponse(
                 500,
                 null,
                 error.message
            )
        )
    }
})

const verifyCode = asynhandler(async(req,res) => {
    console.log("req.body",req.body)
    const verifyData = verifySchema.safeParse(req.body)
    console.log("verifyData",verifyData)
    if(!verifyData.success){
        const errors = verifyData.error.format().verifyCode?._errors || [];
        console.log("errors",errors)
        return res.json(
            new apiResponse(
                400,
                null,
                "Code Sent Failure"
            )
        )
    }
   try {
    const {username,verifyCode} = verifyData.data;
     const user = await User.findOne({
         username
     })
     console.log("user",user)
     if(!user){
         return res.json(
             new apiResponse(
                 404,
                 null,
                 "user not found"
             )
         )
     }
 
     const isCodeValid = user.verifyCode === verifyCode ;
     const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
     console.log("isCodeValid",isCodeValid)
     console.log("isCodeExpired",isCodeExpired)
     
     if(isCodeValid && isCodeExpired){
         user.isVerified = true;
         await user.save()
         return res.json(
             new apiResponse(
                 200,
                 null,
                 "user verified successfully"
             )
         )
     }
    else if(!isCodeExpired){
         return res.json(
             new apiResponse(
                 400,
                 null,
                 "Code Expired"
             )
         )
     }
     else{
         return res.json(
             new apiResponse(
                 400,
                 null,
                 "Code Invalid"
             )
         )
     }
 
   } catch (error) {
       return res.json(
           new apiResponse(
               500,
               null,
               error.message
           )
       )
    
   }



})  

const loginUser = asynhandler(async(req,res) => {
})

const failedLogin = asynhandler(async(req,res) => {
    return res.json(
        new apiResponse(
            400,
            null,
            "Login Failed"
        )
    )
}
)
export  {
    registerUser,
    verifyCode,
    loginUser,
    googleLogin,
    failedLogin
}


