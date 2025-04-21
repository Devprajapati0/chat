import {Chat} from '../models/chat.model.js';
import {User} from '../models/user.model.js';
import asynhandler from '../utils/asynchandler.js';
import { groupChatSchema,addMembersSchema, removeMembersSchema, makeAdminSchema , removeAdminSchema, updateGroupProfileSchema} from '../schema/chat.schema.js';
import apiResponse from '../utils/apiResponse.js';
import { emitEvent } from '../utils/features.js';
import { ALERT,REFETECH_CHATS } from '../helpers/events.js';
import mongoose from 'mongoose';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//alert me mesage and chatid doneo abj me dallo
const createGroup = asynhandler(async (req, res) => {
    console.log("Create Group", req.body);
  
    const groupData = groupChatSchema.safeParse(req.body);
    console.log("Group Data", groupData);
  
    if (!groupData.success) {
      return res.json(
        new apiResponse(400, null, groupData.error.errors)
      );
    }
  
    try {
      if (!req.user) {
        return res.json(new apiResponse(400, null, "User must login"));
      }
  
      const { name, members, addmembersallowed = false, sendmessageallowed = true } = groupData.data;
      const allmembers = [...members, req.user._id];

      const enrichedMembers = await User.find({ _id: { $in: allmembers } })
  .select('_id publicKey') // You can include more fields if needed
  .lean(); 


      
      const chat = new Chat({
        name,
        members: enrichedMembers,
        creator: req.user._id,
        groupChat: true,
        addmembersallowed,
        sendmessageallowed,
        isAdmin: [req.user._id]
    });
    if(req.file){
      console.log("File",req.file);
      const url =await req.file?.path; 
      const fileUpload = await uploadOnCloudinary(url)
      console.log("fileUpload",fileUpload)
      chat.avatar = {
        public_id: fileUpload.public_id,
        url: fileUpload.secure_url
      };
    }
  
      await chat.save();

  
      if (!chat) {
        return res.json(
          new apiResponse(400, null, "Failed to create group")
        );
      }

      //save it in user 
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.json(
          new apiResponse(400, null, "User not found")
        );
      }
      user.chats.push(chat._id);
      await user.save();
  
      emitEvent(req, ALERT, allmembers, `${req.user.name} created a new group chat ${name}`);
      emitEvent(req, REFETECH_CHATS, members, null);
  
      return res.json(new apiResponse(200, chat, "Group created"));
    } catch (error) {
      console.log(error);
      return res.json(new apiResponse(500, null, "Failed to create group"));
    }
});
  
const getMyChats = asynhandler(async (req, res) => {
        try {
          const userId = new mongoose.Types.ObjectId(req.user._id);
          console.log("User ID", userId);
          if (!userId) {
            return res.json(new apiResponse(400, null, "User must login"));
          }
      
          const chats = await Chat.aggregate([
            {
              $match: {
                members: {  $elemMatch: {
                  _id: userId // Or use any other matching criteria for _id
                } }
              }
            },
            {
              $sort: { updatedAt: -1 }
            },
            // Lookup creator info
            {
              $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
              }
            },
            { $unwind: "$creator" },
            // Lookup members info
            {
              $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members"
              }
            },
            // Add displayName and displayAvatar dynamically
            {
              $addFields: {
                displayInfo: {
                  $cond: {
                    if: "$groupChat",
                    then: {
                      displayName: "$name",
                      displayAvatar: "$avatar.url"
                    },
                    else: {
                      $let: {
                        vars: {
                          otherUser: {
                            $first: {
                              $filter: {
                                input: "$members",
                                as: "member",
                                cond: { $ne: ["$$member._id", userId] }
                              }
                            }
                          }
                        },
                        in: {
                          displayName: "$$otherUser.username",
                          displayAvatar: "$$otherUser.avatar.url"
                        }
                      }
                    }
                  }
                }
              }
            },
            // Project final result
            {
              $project: {
                _id: 1,
                name: 1,
                groupChat: 1,
                members: { _id: 1, username: 1, avatar: 1 },
                creator: { _id: 1, username: 1, avatar: 1 },
                avatar: 1,
                lastmessage: 1,
                updatedAt: 1,
                createdAt: 1,
                displayName: "$displayInfo.displayName",
                displayAvatar: "$displayInfo.displayAvatar"
              }
            }
          ]);
          console.log("Chats", chats);
      
          return res.json(new apiResponse(200, chats, "Chats fetched"));
        } catch (error) {
          console.log(error);
          return res.json(new apiResponse(500, null, "Failed to fetch chats"));
        }
});

const getMyGroups = asynhandler(async (req, res) => {
    try {
       if(!req.user) {
          return res.json(new apiResponse(400, null, "User must login"));
        }
        const groups = await Chat.find({
            members:{$in:[req.user._id]},
            groupChat:true
        })

        console.log('Groups',groups);
        if(!groups){
            return res.json(new apiResponse(400, null, "Failed to fetch groups"));
        }
    
        return res.json(new apiResponse(200,groups , "Chats fetched"));
      } catch (error) {
        console.log(error);
        return res.json(new apiResponse(500, null, "Failed to fetch chats"));
      }
}
);

const makeAdmin = asynhandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.json(new apiResponse(400, null, "User must login"));
        }

        const makeAdminData = makeAdminSchema.safeParse(req.body);
        if (!makeAdminData.success) {
            return res.json(new apiResponse(400, null, makeAdminData.error.errors));
        }
        console.log("Make Admin Data", makeAdminData.data);
        const { chatId, userId } = makeAdminData.data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.json(new apiResponse(400, null, "Chat not found"));
        }

        const isAdmin = chat.isAdmin.some(
            (adminId) => adminId.toString() === req.user._id.toString()
        );

        if (!isAdmin) {
            return res.json(new apiResponse(403, null, "Only admins can make others admin"));
        }

        const isMember = chat.members.some(
            (memberId) => memberId.toString() === userId
        );

        if (!isMember) {
            return res.json(new apiResponse(400, null, "User must be a group member first"));
        }

     
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { isAdmin: userId } }, // $addToSet prevents duplicates
            { new: true }
        );

        if (!updatedChat) {
            return res.json(new apiResponse(400, null, "Failed to make admin"));
        }

        // Emit events if needed
        emitEvent(req, ALERT, updatedChat.members, `${req.user.name} made a member admin`);
        emitEvent(req, REFETECH_CHATS, updatedChat.members, null);

        return res.json(new apiResponse(200, updatedChat, "Member made admin successfully"));

    } catch (error) {
        console.log("Make admin error:", error);
        return res.json(new apiResponse(500, null, "Something went wrong while making admin"));
    }
});

const removeAdmin = asynhandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.json(new apiResponse(400, null, "User must login"));
        }

        const removeAdminData = await removeAdminSchema.safeParse(req.body);
        if (!removeAdminData.success) {
            return res.json(new apiResponse(400, null, removeAdminData.error.errors));
        }
        const { chatId, userId } = removeAdminData.data;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.json(new apiResponse(400, null, "Chat not found"));
        }
        // Check if the requester is an admin
        const isRequesterAdmin = chat.isAdmin.includes(req.user._id.toString());
        if (!isRequesterAdmin) {
            return res.json(new apiResponse(403, null, "Only admins can remove other admins"));
        }

        const isRemovingSelf = req.user._id.toString() === userId.toString();
        const totalAdmins = chat.isAdmin.length;

        if (isRemovingSelf && totalAdmins === 1) {
            return res.json(new apiResponse(400, null, "You are the only admin. You must assign another admin before removing yourself."));
        }

        // Remove the user from isAdmin array
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { isAdmin: userId } },
            { new: true }
        );

        if (!updatedChat) {
            return res.json(new apiResponse(400, null, "Failed to remove admin"));
        }

        return res.json(new apiResponse(200, updatedChat, "Admin privileges removed"));
    } catch (error) {
        console.log(error);
        return res.json(new apiResponse(500, null, "Failed to update chat"));
    }
});

const membersUseriaAllowesToAdd = asynhandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.json(new apiResponse(400, null, "User must login"));
        }
        
        const { chatId } = req.body;
        
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.json(new apiResponse(400, null, "Chat not found"));
        }
        
        // Fetch all users except the current user
        const users = await User.find({
            _id: { $ne: req.user._id }
        }).select("-password -email -isVerified -verifyCode -createdAt -updatedAt -__v -verifyCodeExpiry -refreshToken ");
        
        // Add status info for each user
        const result = users.map(user => {
            const isPresent = chat.members.some(memberId =>
                memberId.toString() === user._id.toString()
            );
            return {
                ...user.toObject(),
                alreadyPresent: isPresent,
                statusText: isPresent ? "Already in group" : "Can be added"
            };
        });
        
        return res.json(new apiResponse(200, result, "Users fetched successfully"));
    } catch (error) {
        console.error("Error fetching allowed users:", error);
        return res.json(new apiResponse(500, null, "Failed to fetch users"));
    }
});

const addMembers = asynhandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.json(new apiResponse(400, null, "User must login"));
        }
        
        const addmembers = addMembersSchema.safeParse(req.body);
        if (!addmembers.success) {
            return res.json(new apiResponse(400, null, addmembers.error.errors));
        }
        
        const { chatId, members } = addmembers.data;
        const chat = await Chat.findById(chatId);
        
        if (!chat) {
            return res.json(new apiResponse(400, null, "Group not found"));
        }
        console.log("user_id",req.user._id);console.log("admin",chat.isAdmin);
        const isAdmin = chat.isAdmin.some(
            (adminId) => adminId.toString() === req.user._id.toString()
        );
        
        // If addmembersallowed is false AND the user is not an admin → reject
        if (!chat.addmembersallowed && !isAdmin) {
            return res.json(new apiResponse(400, null, "You are not allowed to add members"));
        }
        
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    members: { $each: members }
                }
            },
            { new: true }
        );
        
        if (!updatedChat) {
            return res.json(new apiResponse(400, null, "Failed to add members"));
        }
        // Emit event to notify other members
        const allusers = updatedChat.members;
        emitEvent(req, ALERT, allusers, `${req.user.name} added new members to the group`);
        emitEvent(req, REFETECH_CHATS, allusers, null);
        
        return res.json(new apiResponse(200, updatedChat, "Members added"));
    } catch (error) {
        console.log(error);
        return res.json(new apiResponse(500, null, "Failed to add members"));
    }
});

const removeMembers = asynhandler(async (req, res) => {
    try {
      if (!req.user) {
        return res.json(new apiResponse(400, null, "User must login"));
      }
  
      const removemembers = removeMembersSchema.safeParse(req.body);
      if (!removemembers.success) {
        return res.json(new apiResponse(400, null, removemembers.error.errors));
      }
  
      const { chatId, userId } = removemembers.data;
  
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.json(new apiResponse(404, null, "Group not found"));
      }
  
      const isAdmin = chat.isAdmin.some(
        (adminId) => adminId.toString() === req.user._id.toString()
      );
  
      if (!isAdmin) {
        return res.json(new apiResponse(403, null, "You are not allowed to remove members"));
      }
  
    
      if (userId.toString() === req.user._id.toString()) {
        return res.json(new apiResponse(400, null, "You can't remove yourself from the group"));
      }
  
     
      const isMember = chat.members.some(
        (memberId) => memberId.toString() === userId.toString()
      );
  
      if (!isMember) {
        return res.json(new apiResponse(400, null, "User is not a member of this group"));
      }
  
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: {
            members: userId,
            isAdmin: userId, // optional: also remove if the person being removed is an admin
          },
        },
        { new: true }
      );
  
      if (!updatedChat) {
        return res.json(new apiResponse(500, null, "Failed to remove member"));
      }
  
      const allUsers = updatedChat.members;
  
      // Emit real-time events
      emitEvent(req, ALERT, allUsers, `${req.user.name} removed a member from the group`);
      emitEvent(req, REFETECH_CHATS, allUsers, null);
  
      return res.json(new apiResponse(200, updatedChat, "Member removed successfully"));
    } catch (error) {
      console.error("Error removing member:", error);
      return res.json(new apiResponse(500, null, "Something went wrong while removing the member"));
    }
});

const leaveGroup = asynhandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.json(new apiResponse(400, null, "User must login"));
        }

        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.json(new apiResponse(404, null, "Group not found"));
        }

        
        const isAdmin = chat.isAdmin.some(
            (adminId) => adminId.toString() === req.user._id.toString()
        );

        if (isAdmin && chat.isAdmin.length === 1) {
            return res.json(new apiResponse(400, null, "Cannot leave. You're the only admin."));
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: {
                    members: userId,
                    isAdmin: userId,
                },
            },
            { new: true }
        );

        if (!updatedChat) {
            return res.json(new apiResponse(500, null, "Failed to leave group"));
        }

        emitEvent(req, ALERT, updatedChat.members, `${req.user.name} left the group`);
        emitEvent(req, REFETECH_CHATS, updatedChat.members, null);

        return res.json(new apiResponse(200, updatedChat, "Left group successfully"));
    } catch (error) {
        console.error("Error leaving group:", error);
        return res.json(new apiResponse(500, null, "Something went wrong"));
    }
});


const updateGroupProfile = asynhandler(async (req, res) => {
  try {
        if (!req.user) {
            return res.json(new apiResponse(400, null, "User must login"));
        }

        const { chatId } = req.params;
        const updateData = await updateGroupProfileSchema.safeParse(req.body);
        if (!updateData.success) {
            return res.json(new apiResponse(400, null, updateData.error.errors));
        }
        console.log("Update Group Data", updateData.data);
        const { name, sendmessageallowed, addmembersallowed } = updateData.data;
      
        let avatar;

        if(req.file){
            console.log("File",req.file);
            const url =await req.file?.path; 
            const fileUpload = await uploadOnCloudinary(url)
            console.log("fileUpload",fileUpload)
            avatar = {
              public_id: fileUpload.public_id,
              url: fileUpload.secure_url
            };
          }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.json(new apiResponse(404, null, "Group not found"));
        }

        const isAdmin = chat.isAdmin.includes(req.user._id.toString());
        if (!isAdmin) {
            return res.json(new apiResponse(403, null, "Only admins can update group profile"));
        }

        // Prepare the fields to update
        const updateFields = {};
        if (name) updateFields.name = name;
        if (avatar) updateFields.avatar = avatar;
        if(sendmessageallowed) updateFields.sendmessageallowed = sendmessageallowed;
        if(addmembersallowed) updateFields.addmembersallowed = addmembersallowed;

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedChat) {
            return res.json(new apiResponse(500, null, "Failed to update group profile"));
        }

        emitEvent(req, ALERT, updatedChat.members, `${req.user.name} updated the group profile`);
        emitEvent(req, REFETECH_CHATS, updatedChat.members, null);

        return res.json(new apiResponse(200, updatedChat, "Group profile updated successfully"));
    } catch (error) {
        console.error("Error updating group profile:", error);
        return res.json(new apiResponse(500, null, "Something went wrong"));
    }
}
);

const getInvidualChat = asynhandler(async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.json(new apiResponse(400, null, "Chat ID is required"));
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.json(new apiResponse(404, null, "Chat not found"));
        }

        return res.json(new apiResponse(200, chat, "Chat fetched successfully"));
    } catch (error) {
        console.error("Error fetching individual chat:", error);
        return res.json(new apiResponse(500, null, "Something went wrong"));
    }
});

const getCommonGroups = asynhandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUser = req.user._id;

    if (!userId) {
      return res.json(new apiResponse(400, null, "User ID is required"));
    }

    const groups = await Chat.find({
      groupChat: true,
      members: { $all: [userId, currentUser] }
    })
    .select("_id name avatar updatedAt members creator"); 

    if (!groups || groups.length === 0) {
      return res.json(new apiResponse(404, null, "No common groups found"));
    }

    return res.json(new apiResponse(200, groups, "Common groups fetched successfully"));
  } catch (error) {
    console.error("Error fetching common groups:", error);
    return res.json(new apiResponse(500, null, "Something went wrong"));
  }
});


const getPublicKey  = asynhandler(async(req,res) => {
  const {chatId} = req.params;
  console.log("Chat ID",chatId);
  if(!chatId){
    return res.json(new apiResponse(400,null,"Chat ID is required"));
  }

  const chat = await Chat.findById(chatId);
  if(!chat){
    return res.json(new apiResponse(404,null,"Chat not found"));
  }
  
  
  console.log("Chat",chat);

  return res.json(new apiResponse(200,chat,"Public key fetched successfully"));
})



  export  { 
    createGroup,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMembers,
    makeAdmin,
    removeAdmin,
    membersUseriaAllowesToAdd,
    leaveGroup,
    updateGroupProfile,
    getInvidualChat,
    getCommonGroups,
    getPublicKey
  
};