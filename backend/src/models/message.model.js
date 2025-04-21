
import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const AttachmentSchema = new Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['image', 'videos',"video", 'raw'],
    required: true,
  },
});

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    attachments: [AttachmentSchema],

   
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },


    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedForEveryoneAt: {
      type: Date,
      default: null,
    },

    // 🧍 DELETE FOR ME
    deletedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true }
);

export const Message = mongoose.models.Message || model("Message", messageSchema);
