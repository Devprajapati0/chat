import { Stack, Typography, Divider, Box } from "@mui/material";
import ChatItem from "../shared/ChatItem";

export const ChatList = ({
  w = "100%",
  chats = [],
  chatID,
  onlineUsers = [],
  newMessageAlert,
  handleDeleteChat,
}) => {
  // console.log("chats", chats);
  return (
    <Box
      width={w}
      height="100%"
      sx={{
        overflowY: "auto",
        borderRadius: 2,
        bgcolor: "#ffffff",
        boxShadow: 1,
        px: 1,
        py: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: 1, color: "#1976d2" }}
      >
        Your Chats
      </Typography>
      <Divider sx={{ mb: 1 }} />

      <Stack spacing={1}>
        {chats.map((data, index) => {
          const { avatar, _id, name, groupChat = false, members = [] } = data;

          const isOnline = groupChat
            ? false
            : members?.some((member) => onlineUsers.includes(member._id));

          const alert =
            newMessageAlert.find((item) => item.chatId === _id) || { count: 0 };
        
          return (
            <ChatItem
              key={_id}
              index={index}
              avatar={avatar}
              name={name}
              _id={_id}
              groupChat={groupChat}
              isOnline={isOnline}
              newMessageAlert={alert}
              handleDeleteChat={handleDeleteChat}
              isSelected={_id === chatID}
            />
          );
        })}
        {chats.length === 0 && (
          <Typography variant="body2" color="textSecondary" textAlign="center">
            No chats available
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
