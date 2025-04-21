import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Stack, Typography, Badge, Box } from "@mui/material";
import AvatarCard from "./AvatarCard";
import {motion} from "framer-motion";

const ChatItem = React.memo(function ChatItem({
  avatar = {},
  name,
  _id,
  groupChat = false,
  newMessageAlert,
  handleDeleteChat,
  isOnline = false,
  isSelected = false,
}) {
  // console.log("alert", newMessageAlert);
  return (
    <Link
      to={`/chat/${_id}`}
      style={{ textDecoration: "none" }}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: isSelected ? "#e3f2fd" : "transparent",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#f5f5f5",
            boxShadow: 1,
          },
        }}
      >
        {/* Avatar with Online Badge */}
        <Badge
          variant="dot"
          color="success"
          overlap="circular"
          invisible={!isOnline}
          sx={{
            "& .MuiBadge-badge": {
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "2px solid white",
              backgroundColor: "#44b700",
              top: 4,
              right: 4,
            },
          }}
        >
          <AvatarCard
            src={avatar?.url || "/default-avatar.png"}
            alt={name}
            sx={{ width: 50, height: 50 }}
          />
        </Badge>

        {/* Chat Info */}
        <Stack spacing={0.5}>
          <Typography
            fontWeight="600"
            color="text.primary"
            noWrap
            maxWidth="180px"
          >
            {name}
          </Typography>

          {newMessageAlert?.count > 0 && (
            <Typography
              sx={{
                fontSize: "12px",
                bgcolor: "#1976d2",
                color: "white",
                px: 1,
                py: 0.25,
                borderRadius: "10px",
                display: "inline-block",
                width: "fit-content",
                fontWeight: 500,
              }}
            >
              {newMessageAlert.count} new message
              {newMessageAlert.count > 1 ? "s" : ""}
            </Typography>
          )}
        </Stack>
      </Box>
    </Link>
  );
});

ChatItem.propTypes = {
  avatar: PropTypes.shape({
    url: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  groupChat: PropTypes.bool,
  newMessageAlert: PropTypes.shape({
    chatID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count: PropTypes.number,
  }),
  handleDeleteChat: PropTypes.func.isRequired,
  isOnline: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default ChatItem;
