import { Avatar, AvatarGroup, Stack } from "@mui/material";
import React from "react";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max} sx={
        {
          position:"relative"
        }
      } >
        {avatar.map((src, index) => (
          <Avatar
            key={index} // ✅ Use index instead of Math.random
            src={src}
            alt={`Avatar ${index}`}
            sx={{
              width: "3rem",
              height: "3rem",
              border: "2px solid white",
            }}
          />
        ))}
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
