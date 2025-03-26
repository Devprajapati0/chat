import { memo } from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { fileFormat } from "../../lib/feature";
import RenderAttachment from "./RenderAttachment";

export const samplemessage = [
  {
    attachment: [
      {
        public_id: "img1",
        //i have a image in my current folder i awant to put that imahe here 
        url:"https://imgs.search.brave.com/_yV-m2EQ6woxay1l_M4PA993pz2lHPX_quV-84L7NPs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTc4/NTgwODI1OS9waG90/by9uZXR3b3JraW5n/LW9wcG9ydHVuaXRp/ZXMuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXBnckIzUHky/S0phT21vaGo3d1JZ/bUlnMGZyamdTQzBu/WEJCZmJEYi1ISDQ9"

      },
    ],
    content: "Hello! How are you?",
    _id: "1",
    sender: {
      _id: "1",
      name: "John",
    },
    chat: "chat_id",
    createdAt: "2021-09-30T12:00:00.000Z",
  },
  {
    attachment: [
      {
        public_id: "img2",
        url:"https://imgs.search.brave.com/_yV-m2EQ6woxay1l_M4PA993pz2lHPX_quV-84L7NPs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTc4/NTgwODI1OS9waG90/by9uZXR3b3JraW5n/LW9wcG9ydHVuaXRp/ZXMuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXBnckIzUHky/S0phT21vaGo3d1JZ/bUlnMGZyamdTQzBu/WEJCZmJEYi1ISDQ9"
      },
    ],
    content: "Hey John! I'm good, thanks!",
    _id: "2",
    sender: {
      _id: "4",
      name: "Alice",
    },
    chat: "chat_id",
    createdAt: "2021-09-30T12:05:00.000Z",
  },
];

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachment, createdAt } = message;

  const isUserMessage = sender._id === user._id;

  return (
    <Stack
      direction="row"
      justifyContent={isUserMessage ? "flex-end" : "flex-start"}
      alignItems="center"
      spacing={1}
      sx={{ width: "100%", mb: 2 }}
    >
      {/* Sender's Avatar (If it's not the user) */}
      {!isUserMessage && <Avatar>{sender.name[0]}</Avatar>}

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
          {sender.name}
        </Typography>

        {/* Display Message Text */}
        {content && (
          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {content}
          </Typography>
        )}

        {/* Display Attachments (Images or Files) */}
        {attachment?.length > 0 && attachment.map((file, index) => (
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
      {isUserMessage && <Avatar>{user.name[0]}</Avatar>}
    </Stack>
  );
};

export default memo(MessageComponent);
