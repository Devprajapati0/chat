import { Stack } from "@mui/material";
import ChatItem from "../shared/ChatItem";

export const ChatList = ({
  w = "100%",
  chats = [], 
  chatID,
  onlineUsers = [],
  newMessageAlert = [
    {
        chatID:"0",
        count:0
    }
  ],
  handleDeleteChat,
}) => {
    
  return (
    <Stack overflow={"auto"} width={w} height={"100%"} direction="column">
      {chats.map((data,index) => {
        const { avatar, _id, name, groupchat, members } = data;
        
        const alert = newMessageAlert.find(
            ({ chatID }) => chatID === _id
        ) || { count: 0 };

        const isOnline = members?.some((member) => onlineUsers.includes(_id));
        
        return (
          <ChatItem 
            key={_id}
            index={index}
            avatar={avatar}
            name={name}
            _id={_id}
            groupChat={groupchat}
            isOnline={isOnline}
            newMessageAlert={alert}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};
