import apiResponse from "../utils/apiresponse.js";
import {User} from "../models/user.model.js";
import asynhandler from "../utils/asynchandler.js";
import { signupSchema, verifySchema,loginSchema, usernameScheam, forgotPasswordSchema, updateProfileSchema, changePasswordSchema } from "../schema/user.schema.js";
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
      if(!accessToken || !refreshToken){
        return res.json(new apiResponse(400, null, "Token generation failed"));
      }
  
      // Cookie options
      const options = {
        httpOnly: true,
        secure: true, // Secure only in production
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
      res.json(new apiResponse(500, null, error.message));
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
                console.log("hasheuejdnjs",signupData.data.password)
                const hashedPassword = await bcrypt.hash(signupData.data.password,12);
                existingEmail.password = hashedPassword
                existingEmail.verifyCode = verifyCode
                existingEmail.verifyCodeExpiry = new Date(Date.now() + 60000); // 1 minute expiry
                await existingEmail.save()
                console.log("existingEmail",existingEmail)
                
           }
        }
        else{
            console.log("hasheuejdnjs",signupData.data.password)
            const url =await req.file?.path; 
            const fileUpload = await uploadOnCloudinary(url)
            console.log("fileUpload",fileUpload)
            const hashedPassword = await bcrypt.hash(signupData.data.password,12);
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 1); // Set expiry for 1 minute            
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
         const { accessToken, refreshToken } = await generateAccessTokenRefreshToken(user._id);
         console.log("accessToken",accessToken)
         console.log("refreshToken",refreshToken)
         // Save refresh token in the database
         user.refreshToken = refreshToken;
         await user.save();
     
         const options = {
             httpOnly: true,
             secure:true, // Secure only in production
           };
       
           // Set access & refresh tokens in cookies
           return res
             .status(200)
             .cookie("accessToken", accessToken, options)
             .cookie("refreshToken", refreshToken, options)
             . json(
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
    try {
        console.log("req.body",req.body)
    const validationResult = loginSchema.safeParse(req.body);
    console.log("validationResult",validationResult)
    if (!validationResult.success) {
      return res.json(
        new apiResponse(400, null, "Invalid credentials")
      )
    }

    const { identifier, password } = validationResult.data;

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    console.log("user",user)
    if (!user) {
      return res.json(
        new apiResponse(404, null, "User not found")
      )
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);
    console.log("Password Match Result:", isMatch);
    if (!isMatch) {
      return res.json(
        new apiResponse(400, null, "Incorrect password")
      )
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenRefreshToken(user._id);
    if(!accessToken || !refreshToken){
        return res.json(new apiResponse(400, null, "Token generation failed"));
      }

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    const options = {
        httpOnly: true,
        secure: true, // Secure only in production
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
    console.error("Login Error:", error);
    return res.json(new apiResponse(500, null, error.message));
  }
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

const usernameUnique = asynhandler(async(req,res) => {
    const {username} = req.query;
    console.log("username",username)

    const usernameData = usernameScheam.safeParse({username})
    console.log("usernameData",usernameData)
    if(!usernameData.success){
        return res.json(
            new apiResponse(
                400,
                null,
                "Invalid username"
            )
        )
    }
    try {
       const usernameExisted = await User.findOne({
           username,
           isVerified:true
       })
       console.log("usernameExisted",usernameExisted)

       if(usernameExisted){
           return res.json(
               new apiResponse(
                   400,
                   null,
                   "username already taken"
               )
           )
       }
       return res.json(
           new apiResponse(
               200,
               null,
               "username available"
           )
       )
    } catch (error) {
        return res.json(
            new apiResponse(
                500,
                null,
              "Error while verify the username"
            )
        )
    }
})

const forgotPassword = asynhandler(async(req,res) => {
    console.log("req.body",req.body)
  const validationResult = forgotPasswordSchema.safeParse(req.body);
  console.log("validationResult",validationResult)
  if (!validationResult.success) {
    return res.json(
      new apiResponse(400, null, "Invalid data")
    )
  }
  

  const { identifier, newpassword ,confirmpassword} = validationResult.data;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
        return res.json(
            new apiResponse(404, null, "User not found")
        )
    }
   
    if(newpassword !== confirmpassword){
        return res.json(
            new apiResponse(400, null, "Passwords do not match")
        )
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 12);
    user.password = hashedPassword;
    await user.save();

    return res.json(
        new apiResponse(200, null, "Password updated successfully")
    )
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.json(new apiResponse(500, null, "Error resetting password"));
  }
});

const resendEmail = asynhandler(async(req,res) => {
    const {username} = req.body;
    console.log("username",username)

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    try {
        const user = await User.findOne({
            username,
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
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 60000);
        await user.save()
        const emailResponse = await sendVerificationEmail(user.username,user.email,verifyCode)
        console.log("emailResponse",emailResponse)
        return res.json(
            new apiResponse(
                200,
                null,
                "Email sent successfully"
            )
        )
    } catch (error) {
        return res.json(
            new apiResponse(
                500,
                null,
                "Error while sending email"
            )
        )
    }
}
)

const logoutUser = asynhandler(async(req,res) => {
    const options = {
        httpOnly:true,
        secure: true

    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new apiResponse(
            200,
            null,
            "userlogout successfully"

        )
    )

})

const getProfileDetails = asynhandler(async(req,res) => {
    const user = req.user;
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
    return res.json(
        new apiResponse(
            200,
            user,
            "user details"
        )
    )
})

const updateProfileDetails = asynhandler(async(req,res) => {
    const userId = req.user.id; // Extract user ID from JWT middleware

    const profileData = updateProfileSchema.safeParse(req.body);
    if (!profileData.success) {
        return res.json(
            new apiResponse(
                400,
                null,
                "Invalid data"
            )
        )
    }
    console.log("profileData",profileData)

    try {
        const { username, bio } = profileData.data;
        const user = await User.findById(userId);
        if (!user) {
           return res.json(
                new apiResponse(
                     404,
                     null,
                     "User not found"
                )
           )
        }

        // Update username & bio if provided
        user.username = username || user.username;
        user.bio = bio || user.bio;


        // Handle avatar update
        if (req.file) {
            const url = req.file.path;
            const fileUpload = await uploadOnCloudinary(url);
            user.avatar = {
                public_id: fileUpload.public_id,
                url: fileUpload.url,
            };
        }


        await user.save();
        console.log("user",user)

        return res.json(
            new apiResponse(
                200,
                null,
                "Profile updated successfully"
            )
        )
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.json(new apiResponse(500, null, "Error updating profile"));
}})

const changePassword = asynhandler(async(req,res) => {
    const userId = req.user.id; 
   console.log("req.body",req.body)
    const passwordData = changePasswordSchema.safeParse(req.body);
    if (!passwordData.success) {
        return res.status(400).json(
            new apiResponse(400, null, "Invalid password data")
        );
    }
    console.log("password",passwordData)

    try {
        const { oldpassword, newpassword, confirmpassword } = passwordData.data;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(
                new apiResponse(404, null, "User not found")
            );
        }
        console.log("user",user)

        if (newpassword !== confirmpassword) {
            return res.status(400).json(
                new apiResponse(400, null, "New passwords do not match")
            );
        }
        // Verify old password
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            return res.status(400).json(
                new apiResponse(400, null, "Old password is incorrect")
            );
        }


        // Hash the new password
        const hashedPassword = await bcrypt.hash(newpassword, 12);
        user.password = hashedPassword;

        // Save updated password
        await user.save();
        console.log("user",user)

        return res.status(200).json(
            new apiResponse(200, null, "Password updated successfully")
        );
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json(
            new apiResponse(500, null, "Error changing password")
        );
    }
})


export  {
    registerUser,
    verifyCode,
    loginUser,
    googleLogin,
    failedLogin,
    usernameUnique,
    forgotPassword,
    resendEmail,
    logoutUser,
    getProfileDetails,
    updateProfileDetails,
    changePassword

}


