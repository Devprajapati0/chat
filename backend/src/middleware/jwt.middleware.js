import jwt from 'jsonwebtoken';
import asynhandler from '../utils/asynchandler.js';
import {User} from '../models/user.model.js';
import apiResponse from '../utils/apiresponse.js';
import dotenv from 'dotenv';
dotenv.config();

const authenticator = asynhandler(async(req,res,next) => {
    try {
        const accessToken = await req.cookies.accessToken || req.headers['Authorization']?.replace('Bearer ','');
        console.log("accessToken",accessToken)
        if(!accessToken) {
            return res.json(
                new apiResponse(401, null,"Unauthorized Access login again")
            )
        }
        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        console.log("decode",decode)
        if(!decode) {
            return res.json(
                new apiResponse(401, null,"Unauthorized Access login again")
            )
        }

        const user = await User.findById(decode._id).select('-password -refreshToken');
        if(!user) {
            return res.json(
                new apiResponse(401, null,"Unauthorized Access login again")
            )
        }
        req.user = user;
        next();
    } catch (error) {
        return res.json(
            new apiResponse(401, null,"Unauthorized Access login again")
        )
    }
})
export default authenticator;