import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import {User} from "./models/user.model.js";
dotenv.config();



const app = express();

app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({limit:'16kb',extended:true}))
app.use(cookieParser())
app.use(express.static("public"))

app.use(passport.initialize());
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.AUTHCLIENTID,
        clientSecret: process.env.AUTHCLIENTSECRET,
        callbackURL: "http://localhost:8000/api/v1/user/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {console.log("profile",profile)
          const userEmail = profile.emails[0].value;
  
          let user = await User.findOne({ email: userEmail }).select("-password -refreshToken");
          console.log("user",user)
  
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          console.log("done",done)
  
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';

app.use('/api/v1/user',userRouter)
app.use('/api/v1/chat',chatRouter)

export default app




