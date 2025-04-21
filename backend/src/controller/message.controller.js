import { Chat } from "../models/chat.model.js";
import asynhandler from "../utils/asynchandler.js";
import  apiResponse  from "../utils/apiResponse.js";
import { emitEvent } from "../utils/features.js";
import { NEW_ATTACHMENT, NEW_MESSAGE_ALERT } from "../helpers/events.js";
import { Message } from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { boolean } from "zod";


//note mssage jab banega to usenm user info daln hai

// const createMessage = asynhandler(async (req, res) => {
//     const { chatId, content, replyTo } = req.body;
//     const senderId = req.user._id;
  
//     if (!chatId || (!content && !replyTo)) {
//       return res.json(new apiResponse(400, null, "Message content or replyTo is required"));
//     }
  
//     const newMessage = new Message({
//       sender: senderId,
//       chat: chatId,
//       content,
//       replyTo: replyTo || null,
//     });
  
//     await newMessage.save();
  
//     await Chat.findByIdAndUpdate(chatId, {
//       lastmessage: newMessage._id,
//     });
  
//     await newMessage.populate([
//       { path: "sender", select: "name avatar" },
//       { path: "replyTo", select: "content sender attachments", populate: { path: "sender", select: "name avatar" } },
//     ]);
//     // new message alert
  
//     return res.json(new apiResponse(200, newMessage, "Message sent successfully"));
// });
  

//Send Message, Get All Messages of a Chat (pagonation), Delete Message (Soft Delete),Get All Media Attachments by Type,Clear Chat for Current User
//not checked yet
/*
New message delivery

Reply to messages
 
Message deletion (from my side or everyone’s)

Typing indicators

Message seen/read status

—are typically done using WebSockets,*/


// const getFileType = (mimetype) => {
//     if (mimetype.startsWith("image/")) return "image";
//     if (mimetype.startsWith("video/")) return "video";
//     if (mimetype === "application/pdf") return "pdf";
//     if (
//       mimetype === "application/msword" ||
//       mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) return "doc";
//     return "other";
// };
  
// const sendAttachments = asynhandler(async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.json(new apiResponse(400, null, "User must login"));
//         }

//         const {chatId} = req.body;
//         if (!chatId) {
//             return res.json(new apiResponse(400, null, "Chat is required"));
//         }
//         const chatFound = await Chat.findById(chatId);
//         if (!chatFound) {
//             return res.json(new apiResponse(400, null, "Chat not found"));
//         }
        
//         const files = req.files || [];
//         const allAttachments = [];

//         //realtime message attachements
//         const messageForRealTime = {
//             sender: {
//                 _id: req.user._id,
//                 username: req.user.username,
//                 avatar: req.user.avatar,
//             },
//             chat: chatId,
//             content: "",
//             attachments: allAttachments
//         }

//         //message for db
       
//         const messageForDB = {
//             sender: req.user._id,
//             chat: chatId,
//             content: "",
//             attachments: allAttachments
//         };

//         //create message 
//         const message = await Message.create(messageForDB);
//         if (!message) {
//             return res.json(new apiResponse(400, null, "Message not created"));
//         }

//         emitEvent(req,NEW_ATTACHMENTS,chatFound.members,{
//             message: messageForRealTime,
//             chatId: chatId,
//             sender: req.user._id,
//             attachments: files
//         });

//         emitEvent(req,NEW_MESSAGE_ALERT,chatFound.members,{
//             message: messageForRealTime,
//             chatId: chatId,
//             sender: req.user._id,
//             attachments: files
//         });

//         return res.json(new apiResponse(200, {
//             message: messageForRealTime,
//             chatId: chatId,
//             sender: req.user._id,
//             attachments: files
//         }, "Attachments sent successfully"));

        
        
//     } catch (error) {
        
//     }
// });

// const getChatMedia = asyncHandler(async (req, res) => {
//     const { chatId } = req.params;
  
//     if (!chatId) {
//       return res.status(400).json(new apiResponse(400, null, "Chat ID is required"));
//     }
  
//     const messages = await Message.find({ chat: chatId }, 'attachments');
  
//     const media = {
//       images: [],
//       videos: [],
//       pdfs: [],
//       docs: [],
//       others: []
//     };
  
//     messages.forEach((msg) => {
//       msg.attachments.forEach((att) => {
//         switch (att.fileType) {
//           case 'image':
//             media.images.push(att);
//             break;
//           case 'video':
//             media.videos.push(att);
//             break;
//           case 'pdf':
//             media.pdfs.push(att);
//             break;
//           case 'doc':
//             media.docs.push(att);
//             break;
//           default:
//             media.others.push(att);
//             break;
//         }
//       });
//     });
  
//     return res.status(200).json(new apiResponse(200, media, "Media fetched successfully"));
// });



const getIndivisualChatMessage = asynhandler(async (req, res, next) => {
    const chatId = req.params.chatId;
    const { page = 1 } = req.query;
    console.log("getIndivisualChatMessage", chatId);
  
    const resultPerPage = 10;
    const skip = (page - 1) * resultPerPage;
    console.log("cjatId", chatId);
  
    const chat = await Chat.findById(chatId);
    console.log("chat", chat);
  
    if(!chat){
        return res.json(new apiResponse(400, null, "Chat not found"));
    }
    //note i have memebers i thus firnat
// _id
// 6804e6e0878f1c564d2f9c43
// publicKey
// "-----BEGIN PGP PUBLIC KEY BLOCK-----

// xjMEaATm4BYJKwYBBAHaRw8BAQdA30Ls…"
   //write code thne
   console.log("chat.members", chat.members);
   console.log("req.user._id", req.user._id);
   let flag = false;
   chat.members.map((member) => {
       if(member._id.toString() === req.user._id.toString()){
        flag = true;
       }
    });
    console.log("flag", flag);  
    if(!flag){
        return res.json(new apiResponse(400, null, "User not found in chat"));
    }
   
    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "username avatar")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);
    console.log("messages", messages);
  
    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;
    const hasNextPage = page < totalPages;
  
    return res.json(
      new apiResponse(
        200,
        {
          data: messages.reverse(), // newest last
          totalPages,
          hasNextPage,
        },
        "Messages fetched successfully"
      )
    );
  });
  
  export const detectFileType = (mimetype) => {
    if (mimetype === "image") return "image";
    if (mimetype === "video") return "videos";
    if (mimetype === "application/pdf") return "pdf";
    if (
      mimetype === "application/msword" ||
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "doc";
    return "other";
  };

  
const sendMessage = async (req, res) => {
    try {
      const { content, chatId, replyTo } = req.body;
      const senderId = req.user._id; // assuming you're using auth middleware
      console.log("Sender ID", senderId);
      console.log("Chat ID", chatId);
      console.log("Content", content);
  
      if (!chatId) return res.status(400).json({ error: "Chat ID is required" });
  
      // 1. 📎 Handle Attachments (Images, Docs, etc.)
      let attachments = [];
      if (req.files && req.files.length > 0) {
        const uploads = await Promise.all(
          req.files.map(async (file) => {
            // console.log("File", file);
            const uploadResult = await uploadOnCloudinary(file.path);
            console.log("skmsks,sls",uploadResult) // return { public_id, url }
            return {
              public_id: uploadResult.public_id,
              url: uploadResult.secure_url,
              fileType: (uploadResult.resource_type),
            };
          })
        );
        attachments = uploads;
      }
      console.log("Attachments", attachments);
  
      // 2. 💬 Create Message
      const newMessage = await Message.create({
        sender: senderId,
        chat: chatId,
        content: content || "",
        attachments,
        replyTo: replyTo || null,
      });
  
      // 3. 🧠 Optionally populate sender & chat for frontend
     
      return res.json(new apiResponse(200, newMessage, "Message sent successfully"));
    }
    catch (error) {
      console.error("Error sending message:", error);
      res.json(new apiResponse(500, null, "Internal Server Error"));  
    }
  }
    
  

export {
    // sendAttachments,
    // createMessage,
    getIndivisualChatMessage,
    sendMessage
}