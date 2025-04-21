import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Title from "../shared/Title";
import Header from "./Header";
import Profile from "../dialogs/Profile";
import { ChatList } from "../specific/ChatList";
import { useMyChatsQuery } from "../../store/api/api";
import useErrors from "../../hooks/Hook";
import { useSocket } from "../../Socket";
import { useSelector } from "react-redux";

const AppLayout = (WrappedComponent) => {
  const ComponentWithLayout = (props) => {
    const socket = useSocket();
    const { data, isLoading, error, isError } = useMyChatsQuery();
    // console.log("data", data);

    const AlertData = useSelector((state) => state.chat);
    // console.log("newMessagesAlert",AlertData.newMessageAlert)

    useEffect(() => {
      if (socket && data?.data) {
        const chatIds = data.data.map(chat => chat._id);
        socket.emit("JOIN_CHATS", chatIds);
      }
    }, [socket, data]);

    useErrors([{ isError, error }]);

    if (!socket) return null;
    if (isLoading) return <div>Loading...</div>;

    const chats = data.data;
    // console.log("chats", chats);

    const handleDeleteChat = (e) => {
      e.preventDefault();
      console.log("Delete Chat Opened");
    };

    return (
      <>
        <Title title="Chat App" description="Chat with your friends" />

        {/* Header */}
        <Box sx={{ backgroundColor: "#1976d2", color: "white", p: 1.5, textAlign: "center" }}>
          <Header />
        </Box>

        {/* Main Layout */}
        <Grid container sx={{ height: "calc(100vh - 6rem)", overflow: "hidden" }}>
          {/* Sidebar */}
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
              bgcolor: "#f5f5f5",
              p: 1,
              borderRight: "1px solid #ccc",
              overflowY: "auto",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Chats
            </Typography>
            <ChatList
              chats={chats}
              onlineUsers={["1", "2"]}
              handleDeleteChat={handleDeleteChat}
              newMessageAlert={AlertData.newMessageAlert}
            />
          </Grid>

          {/* Chat Area */}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            sx={{
              bgcolor: "#ffffff",
              p: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <WrappedComponent {...props} />
          </Grid>

          {/* Profile Sidebar */}
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              bgcolor: "#f0f9ff",
              p: 1,
              overflowY: "auto",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              My Profile
            </Typography>
            <Paper elevation={2} sx={{ p: 1.5 }}>
              <Profile />
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ backgroundColor: "#1976d2", color: "white", p: 1.5, textAlign: "center" }}>
          <Typography variant="body2">© 2025 Chat App. All rights reserved.</Typography>
        </Box>
      </>
    );
  };

  ComponentWithLayout.displayName = `AppLayout(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithLayout;
};

export default AppLayout;
