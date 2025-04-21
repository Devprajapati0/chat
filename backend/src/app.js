import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import {v4 as uuid} from "uuid"
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import {User} from "./models/user.model.js";
import jwt from "jsonwebtoken";
import { Message } from './models/message.model.js';
import {NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING} from "./helpers/events.js"
dotenv.config();

const app = express();

app.use(cors({
    origin:"http://localhost:5173", 
    credentials:true
}))


//socket io
import {Server} from "socket.io"
import http from "http"
export const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
});


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

//socket
const socketAuthenticator = async (err, socket, next) => {
  try {
    // Extract token from cookie or authorization header
    const token =
      socket.request?.cookies?.accessToken ||
      socket.request?.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication token missing"));
    }
    console.log("token",token)

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded._id) {
      return next(new Error("Invalid token"));
    }
    console.log("decoded",decoded)

    // Find user
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      return next(new Error("User not found"));
    }
    console.log("user",user)
    // Attach user to socket
    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket authentication error:", err);
    return next(new Error("Authentication error"));
  }
};
io.use((socket, next) => {
  cookieParser()(socket.request,socket.request.resume,async(err)=>{
    await socketAuthenticator(err,socket,next);
    next()
  })
})


  

io.on("connection", (socket) => {
  const user = socket.user;
  // userSocketIDs.set(user._id.toString(), socket.id);

  // User joins all rooms (chatIds) they are part of
  socket.on("JOIN_CHATS", (chatIds) => {
    chatIds.forEach(chatId => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joining room: ${chatId}`);
    });
  });

 
  socket.on("NEW_GROUP_MESSAGE", async ({ messages = [] }) => {
    console.log("New group message event received:", messages);
  
    for (const msg of messages) {
      const messageForRealTime = {
        content: msg.encryptedMessage,   // This is already encrypted+signed
        _id: uuid(),
        sender: msg.from,
        chat: msg.chatId,
        createdAt: new Date().toISOString(),
        attachments: msg.attachments || [],
      };

      const messageForDB = {
        content: msg.encryptedMessage,   // This is already encrypted+signed
        sender: msg.from,
        chat: msg.chatId,
      };
      // console.log("messageForRealTime", messageForRealTime);
      // console.log("messageForDB", messageForDB);
      // Save message to DB
      try {
        const savedMessage = await Message.create(messageForDB);
        console.log("Message saved to DB:", savedMessage);
      }
      catch (error) {
        console.error("Error saving message to DB:", error);
      }
  
      // Emit to the entire chat room (which each user has joined already)
      io.to(msg.chatId).emit(NEW_MESSAGE, {
        chatId: msg.chatId,
        message: messageForRealTime,
      });
    }
  });
  
  

  /*
  socket.on(NEW_MESSAGE, async ({ chatId, message="",attachments=[] }) => {
    console.log("New message event received:", chatId);
    console.log("message",message)
    console.log("attachments",attachments)
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: user,
      chat: chatId,
      createdAt: new Date().toISOString(),
      attachments: attachments || [],
    };

    console.log("messageForRealTime",messageForRealTime)

    const messageForDB = {
      content: message,
      sender: user,
      chat: chatId,
    };

    // Emit to all users in the room (including sender)
    
    io.to(chatId).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    
    
    io.to(chatId).emit(NEW_MESSAGE_ALERT, { chatId });
   
    if (!message.attachments || message.attachments.length === 0) {
      try {
      const savedMessage = await Message.create(messageForDB);
      console.log("Message saved to DB:", savedMessage);
      // Emit to all users in the room (including sender)
      } catch (error) {
      console.error("Error saving message to DB:", error);
      }
    }
  })
    */

  socket.on(START_TYPING, ({ chatId,senderId,sendername }) => {
    console.log("User started typing in chat:", chatId);
    // Emit to everyone else in the room
    socket.to(chatId).emit(START_TYPING, { chatId, senderId,sendername });
  }
  );
  socket.on("STOP_TYPING", ({ chatId,senderId,sendername}) => {
    console.log("User stopped typing in chat:", chatId);
    socket.to(chatId).emit("STOP_TYPING", { chatId,senderId,sendername });
  }
  );
/*
  
*/
  socket.on("disconnect", () => {
    console.log("User disconnected:");
    // userSocketIDs.delete(user._id.toString());
    // onlineUsers.delete(user._id.toString());÷
    // socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});



import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';
import messageRouter from './routes/message.routes.js';


app.use('/api/v1/user',userRouter)
app.use('/api/v1/chat',chatRouter)
app.use('/api/v1/message',messageRouter)
 
export default app




