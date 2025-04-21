import { memo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import {motion} from "framer-motion";
import { fileFormat } from "../../lib/feature";
import RenderAttachment from "./RenderAttachment";
import { useSelector } from "react-redux";
import AvatarCard from "./AvatarCard";
// chat: "67f0dc54a91b5c403d8f3378"
// content: "zz"
// createdAt: "2025-04-16T10:09:00.425Z"
// sender: 
// _id: "67e8e9cef5edef71a671a98d"
// _id: "2d3d8c80-4841-4f40-b07b-4d34a50eb6d9
const MessageComponent = ({ message }) => {
  const {user} = useSelector((state) => state.auth);
  // console.log("MessageCommkponent", message);
  // console.log("MessageComponrrent", data);
  // const user ={_id:"67e8e9cef5edef71a671a98d"};
  const { sender, content, attachments, createdAt } = message;
   console.log("MessageComponent", sender);
  // console.log("MessageComponent", message);
  const isUserMessage = sender._id === user._id;
  
  return (
    <motion.div
      initial={{ opacity: 0, x:"-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: -10 }}
      direction="row"
      justifyContent={isUserMessage ? "flex-end" : "flex-start"}
      alignItems="center"
      spacing={1}
      sx={{ width: "100%", mb: 2 }}
    >
      {/* Sender's Avatar (If it's not the user) */}
      {!isUserMessage && <AvatarCard avatar ={sender.avatar}/>}

      {/* Message Box */}
      <Box
        sx={{
          maxWidth: "60%",
          padding: "10px",
          borderRadius: "10px",
          bgcolor: isUserMessage ? "#dcf8c6" : "#f2f2f2",
          boxShadow: 1,
          textAlign: "left",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray" }}>
          {sender.username}
        </Typography>

        {/* Display Message Text */}
        {content && (
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {content}
          </Typography>
        )}

        {/* Display Attachments (Images or Files) */}
        {attachments?.length > 0 && attachments.map((file, index) => (
  <Box key={index} sx={{ mt: 1 }}>
    <a
  href={file.url}  // Ensure `file.url` is set correctly
  target="_blank"
  rel="noopener noreferrer"
  style={{ color: "black", textDecoration: "none" }}
  download
>

    {RenderAttachment(fileFormat(file.url), file.url)}
    </a>
  </Box>
))}
        {/* Timestamp */}
        <Typography variant="caption" sx={{ color: "gray", display: "block", mt: 1 }}>
          {new Date(createdAt).toLocaleString()}
        </Typography>
      </Box>

      {/* User's Avatar (If it's the user) */}
      {isUserMessage &&<AvatarCard avatar ={sender.avatar}/>}
    </motion.div>
  );
};

export default memo(MessageComponent);
