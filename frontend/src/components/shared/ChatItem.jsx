import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Stack, Typography, Badge, Avatar, Box } from "@mui/material";
import AvatarCard from "./AvatarCard";

const ChatItem = React.memo(function ChatItem({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender = false,
  isOnline = false,
  newMessageAlert,
  handleDeleteChat,
}) {


  return (
    <Link 
      to={`/chat/${_id}`}
      style={{ color: "black", textDecoration: "none" }}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "row",
          alignItems: "center",
          padding: 2,
          position: "relative",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: sameSender ? "#e0f7fa" : "white",
          color: "black",
          borderRadius: "10px",
          transition: "0.3s",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        {/* Avatar with Online Badge */}
        <Badge
          color="success"
          overlap="circular"
          badgeContent=""
          invisible={!isOnline}
          sx={{
            "& .MuiBadge-badge": {
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "2px solid white",
              backgroundColor: "blue",
            },
          }}
        >
          <AvatarCard sx={{backgroundColor:"green"}} src={avatar || "/default-avatar.png"} alt={name} />
        </Badge>

        {/* Chat Details */}
        <Stack direction="column">
          <Typography fontWeight="bold">{name}</Typography>

          {newMessageAlert?.count > 0 && (
            <Typography
              sx={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "12px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                marginTop: "4px",
              }}
            >
              {newMessageAlert.count} New Messages
            </Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </Box>
    </Link>
  );
});

ChatItem.propTypes = {
  avatar: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  groupChat: PropTypes.bool,
  sameSender: PropTypes.bool,
  isOnline: PropTypes.bool,
  newMessageAlert: PropTypes.shape({
    chatID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: PropTypes.number,
  }),
  handleDeleteChat: PropTypes.func.isRequired,
};

export default ChatItem;