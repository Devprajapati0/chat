const chatSchema = new Schema(
    {
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
        required: true,
        default: false,
      },
    },
    { timestamps: true }
  );
  
  export const Chat = mongoose.models.Chat || model("Chat", chatSchema);
  