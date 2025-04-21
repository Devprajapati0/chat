import { Avatar, AvatarGroup, Stack } from "@mui/material";
import React from "react";

const AvatarCard = ({ avatar, size = "3rem" }) => {
  const imageUrl = avatar?.url || ""; // fallback in case avatar is undefined
  // console.log("Avatar URL:", imageUrl);

  return (
    <Stack direction="row" spacing={0.5}>
      <Avatar
        src={imageUrl}
        alt="User Avatar"
        sx={{
          width: size,
          height: size,
          border: "2px solid white",
        }}
      />
    </Stack>
  );
};

export default AvatarCard;
