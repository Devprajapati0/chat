import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React from "react";
import { Add as AddIcon,Remove as RemoveIcon } from "@mui/icons-material";


  
const UserItem = ({ user, handler, handlerIsLoading,isAdded = false, styling = {} }) => {
  const { _id, name } = user;

  return (
    <ListItem>
      <Stack direction="row" spacing={2} alignItems="center" {...styling}>
        <Avatar />
        <Typography
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width:"100%"
          }}
        >
          {name}
        </Typography>
        <IconButton
          sx={{
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.main" :"primary.dark",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {
            isAdded ? <RemoveIcon /> :<AddIcon />
          }

          
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default React.memo(UserItem);
