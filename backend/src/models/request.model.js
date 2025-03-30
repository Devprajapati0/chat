const requestSchema = new Schema(
    {
      status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    },
    { timestamps: true }
  );
  
  export const Request = mongoose.models.Request || model("Request", requestSchema);
  