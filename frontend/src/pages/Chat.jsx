import { IconButton, Stack, Box } from "@mui/material";
import Applayout from "../components/layout/Applayout";
import { Fragment, useRef } from "react";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from "../components/style/StyleComponenet"; // ✅ Ensure this path is correct
import FileMenu from "../lib/FileMenu";
import MessageComponenet from "../components/shared/MessageComponenet"; // ✅ Ensure this path is correct
import { samplemessage } from "../components/shared/MessageComponenet"; // ✅ Ensure this path is correct

const Chat = () => {
  const containerRef = useRef(null);

  const sendMessageHandler = (event) => {
    event.preventDefault(); // Prevent page reload on form submission
    console.log("Message Sent");
  };

  return (
    <Fragment>
      {/* Chat Message Container */}
      <Stack
        ref={containerRef}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "1rem",
          height: "90%",
          bgcolor: "grey.100", // ✅ Light gray for better contrast
          borderRadius: "10px",
        }}
        spacing={1}
      >
        {samplemessage.map((message) => (
          console.log(message),
          <MessageComponenet key={message._id} message={message} user={{ _id: "1", name: "John" }}  />
        ))}
      </Stack>

      {/* File Menu */}
      <FileMenu />

      {/* Input Box */}
      <form onSubmit={sendMessageHandler} style={{ height: "10%" }}>
        <Stack direction="row" padding="1rem" alignItems="center" spacing={1}>
          {/* Attach File Button */}
          <IconButton
            sx={{
              color: "primary.light",
              "&:hover": {
                color: "primary.main",
                backgroundColor: "#f2f2f2",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
          >
            <AttachFileIcon />
          </IconButton>

          {/* Input Box */}
          <InputBox placeholder="Type a message" sx={{ flexGrow: 1 }} />

          {/* Send Button */}
          <Box ml="auto">
            <IconButton
              type="submit"
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "primary.light",
                  backgroundColor: "#f2f2f2",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Stack>
      </form>
    </Fragment>
  );
};

const WrappedHome = Applayout(Chat);
export default WrappedHome;
