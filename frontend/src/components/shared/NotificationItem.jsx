import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import {Button} from "@mui/material";
import React from "react";
import { Add as AddIcon } from "@mui/icons-material";
const NotificationItem = ({ sender, _id, handler }) => {
    const { name, avatar } = sender;
    return (
      <ListItem>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={avatar} />
          <Typography
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </ListItem>
    );
  };
  
  export default React.memo(NotificationItem);
  