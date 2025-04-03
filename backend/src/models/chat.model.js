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
    },
    { timestamps: true }
  );
  
  export const Chat = mongoose.models.Chat || model("Chat", chatSchema);
  