import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { lazy } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationIcon from "@mui/icons-material/Notifications";
import { Suspense, useState } from "react";
const SearchDialog = lazy(() => import("../specific/Search"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const NotificationDialog = lazy(() => import("../specific/Notification"));

const Header = () => {
  const [ isMobile,setisNewMobile] = useState(false);
  const [ isSearch,setisNewSearch] = useState(false);
  const [ isGroup , setisNewGroup] = useState(false);
  const [isNotifiacation,setisNewNotification] = useState(false);





  const navigate = useNavigate();
  const handleMobile = () => {
    setisNewMobile((prev) => !prev);
  };
  const notificationHandler = () => {
    setisNewNotification((prev) => !prev);
  };

  const openSearchDialog = () => {
    setisNewSearch((prev) => !prev)
  };
  const openNewGroup = () => {
    setisNewGroup((prev) => !prev)
  };
  const navigateGroup = () => {
    navigate("/group");
  };
  const logoutHandler = () => {

  }
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          padding: "1rem",
          flexGrow: 1,
          height: "4rem",
        }}
      >
        <AppBar position="static " sx={{ bgcolor: "#1976d2" }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              Chat App
            </Typography>
            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}></IconButton>
              <MenuIcon />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconButton
                color="inherit"
                size="large"
                onClick={openSearchDialog}
              >
                {" "}
                <SearchIcon />{" "}
              </IconButton>
              <Tooltip title="New Group" arrow>
                {" "}
                <IconButton color="inherit" size="large" onClick={openNewGroup}>
                  {" "}
                  <AddIcon />{" "}
                </IconButton>
              </Tooltip>
              <Tooltip title="Manage Groups">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={navigateGroup}
                >
                  {" "}
                  <GroupIcon />{" "}
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={logoutHandler}
                >
                  {" "}
                  <LogoutIcon />{" "}
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifiaction">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={notificationHandler}
                >
                  {" "}
                  <NotificationIcon />{" "}
                </IconButton>
              </Tooltip>

            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {
        isSearch && (
          <Suspense fallback={<Backdrop open/>}>
          <SearchDialog />
          </Suspense>
        )
      }
      
      {
        isGroup && (
          <Suspense fallback={<Backdrop open/>}>
          <NewGroupDialog />
          </Suspense>
        )
      }

      {
        isNotifiacation && (
          <Suspense fallback={<Backdrop open/>}>
          <NotificationDialog />
          </Suspense>
        )
      }
    </>
  );
};

export default Header;
