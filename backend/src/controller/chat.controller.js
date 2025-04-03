import {Chat} from '../models/chat.model.js';
import asynhandler from '../utils/asynchandler.js';
import { groupChatSchema } from '../schema/chat.schema.js';
import apiResponse from '../utils/apiresponse.js';
import { emitEvent } from '../utils/features.js';
import { ALERT } from '../helpers/events.js';


const createGroup = asynhandler(async (req, res) => {
  console.log('Create Group',req.body);

   const groupData = groupChatSchema.safeParse(req.body);
   console.log('Group Data',groupData);
   if(!groupData.success){
    return res.json(
        new apiResponse(
            400,
            'Validation Error',
            groupData.error.errors
        )
    )
   }
try {
    
   const {name, members} = groupData.data;
   const allmembers = [...members,req.user.username];
   console.log('All Members',allmembers);
    const chat = new Chat({
         name,
         members: allmembers,
         creator: req.user,
         groupChat: true
    });

    await chat.save(); 

    emitEvent(req,ALERT,allmembers,`${req.user.name} created a new group chat ${name}`);
    emitEvent(req,REFETECH_CHATS,members,null);

    return res.json(
        new apiResponse(
            200,
            'Group created',
            chat
        )
    )


} catch (error) {
    console.log(error);
    return res.json(
        new apiResponse(
            500,
            null,
            'Failed to create group',
        )
    )}
   
});

export  { 
    createGroup

};