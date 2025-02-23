import Title from "../shared/Title";
import Grid from "@mui/material/Grid";
import Header from "./Header";
import { ChatList } from "../specific/ChatList";
import { useParams } from "react-router-dom";
import Profile from "../dialogs/Profile";

const AppLayout = (WrappedComponent) => {
  const ComponentWithLayout = (props) => {
    let { chatID } = useParams();
    const handleDeleteChat = (e) => {
      e.preventDefault()
      console.log("Delete Chat Opened");
    };

    const sampledata = [{
      avatar:[""],
      name:"dev",
      _id:"1",
      groupChat:false,
      members:["1","2"]
    },
    {
      avatar:[""],
      name:"ram",
      _id:"2",
      groupChat:false,
      members:["2"]
    }]

    return (
      <>
        {/* Page Metadata */}
        <Title title="Chat App" description="Chat with your friends" />

        {/* Header Section */}
        <div style={{ backgroundColor: "#1976d2", color: "white", padding: "1rem", textAlign: "center" }}>
          <Header />
        </div>

        {/* Main Layout Grid */}
        <Grid container height="calc(100vh - 8rem)">
          {/* Chat List Sidebar (Hidden on Small Screens) */}
          <Grid 
            item 
            sm={4} 
            md={3} 
            sx={{ display: { xs: "none", sm: "block" }, bgcolor: "#f0f0f0", padding: "1rem" }}
          >
            <ChatList 
              chats={sampledata} 
              chatID={chatID}
              onlineUsers={["1","2"]} 
              newMessageAlert={[{ chatID, count: 5 }]} 
              handleDeleteChat={handleDeleteChat} 
            />  
          </Grid>

          {/* Main Chat Section */}
          <Grid 
            item 
            xs={12} 
            sm={8} 
            md={5} 
            lg={6} 
            sx={{ bgcolor: "#ffffff", padding: "1rem" }}
          >
            <WrappedComponent {...props} />
          </Grid>

          {/* Additional Panel (Hidden on Small Screens) */}
          <Grid 
            item 
            sx={{ display: { xs: "none", md: "block" }, bgcolor: "#e3f2fd", padding: "1rem" }} 
            md={4} 
            lg={3}
          >
            {/* Placeholder for Future Widgets */}
            <Profile />
          </Grid>
        </Grid>

        {/* Footer Section */}
        <div style={{ backgroundColor: "#1976d2", color: "white", padding: "1rem", textAlign: "center" }}>
          Footer
        </div>
      </>
    );
  };

  ComponentWithLayout.displayName = `AppLayout(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithLayout;
};

export default AppLayout;