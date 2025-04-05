import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const chatSchema = new Schema(
    {
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      name: {
        type: String,
        required: true,
        trim: true,
      },
      groupChat: {
        type: Boolean,
        default: false,
      },
      avatar: {
        public_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
      lastmessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      addmembersallowed: {
        type: Boolean,
        default: false,
      },
      sendmessageallowed: {
        type: Boolean,
        default: true,
      },
      isAdmin:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    { timestamps: true }
  );
  
  export const Chat = mongoose.models.Chat || model("Chat", chatSchema);
  