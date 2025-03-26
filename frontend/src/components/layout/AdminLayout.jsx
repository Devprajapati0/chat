import { useState } from 'react';
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Dashboard, Logout } from '@mui/icons-material';

const menuItems = [
  {
    name: "Dashboard",
    link: "/admin/dashboard",
    icon: <Dashboard />,
  },
    {
        name: "User Management",
        link: "/admin/user",
        icon: <Dashboard />,
    },
    {
        name: "Message Management",
        link: "/admin/message",
        icon: <Dashboard />,
    },
    {
        name: "Chat Management",
        link: "/admin/chat",
        icon: <Dashboard />,
    },
];
const isAdmin = true;
const SideBar = ({ w, closeDrawer }) => {
  const location = useLocation();

  const logoutHandler = () => {
    console.log("Logout");
  };

  return (
    <Stack
      width={w}
      direction="column"
      spacing="2rem"
      sx={{
        backgroundColor: "#1E3A8A", // Dark Blue
        height: "100vh",
        color: "white",
        padding: "1.5rem",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
        Admin Panel
      </Typography>
      
      <Stack spacing="1rem" direction="column">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index} style={{ textDecoration: "none" }} onClick={closeDrawer}>
            <Stack
              direction="row"
              spacing="1rem"
              alignItems="center"
              sx={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease-in-out",
                bgcolor: location.pathname === item.link ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "transparent",
                color: location.pathname === item.link ? "white" : "#D1D5DB",
                "&:hover": {
                  bgcolor: "#3B82F6",
                  color: "white",
                },
              }}
            >
              {item.icon}
              <Typography sx={{ fontSize: "1rem", fontWeight: "500" }}>{item.name}</Typography>
            </Stack>
          </Link>
        ))}

        {/* Logout Button */}
        <Box onClick={logoutHandler} sx={{ cursor: "pointer" }}>
          <Stack
            direction="row"
            spacing="1rem"
            alignItems="center"
            sx={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor: "#DC2626", // Red
                color: "white",
              },
            }}
          >
            <Logout />
            <Typography sx={{ fontSize: "1rem", fontWeight: "500" }}>Logout</Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };
  if(!isAdmin) {
    return <Navigate to="/admin" />
  }

  return (
    <Grid container minHeight="100vh">
      {/* Mobile Menu Button */}
      <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", top: "1rem", right: "1rem", zIndex: 1500 }}>
        <IconButton onClick={toggleMobileMenu} sx={{ bgcolor: "white", boxShadow: 2 }}>
          {isMobile ? <CloseIcon sx={{ color: "#1E3A8A" }} /> : <MenuIcon sx={{ color: "#1E3A8A" }} />}
        </IconButton>
      </Box>

      {/* Sidebar for Larger Screens */}
      <Grid
        item
        md={3}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
          bgcolor: "#1E3A8A",
          padding: "0",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <SideBar w="100%" />
      </Grid>

      {/* Main Content Area */}
      <Grid item xs={12} md={9} lg={9} sx={{ bgcolor: "#F8FAFC", padding: "2rem" }}>
        {children}
      </Grid>

      {/* Sidebar Drawer for Mobile */}
      <Drawer
        open={isMobile}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "65vw",
            bgcolor: "#1E3A8A",
            color: "white",
            padding: "1rem",
          },
        }}
      >
        <SideBar w="100%" closeDrawer={toggleMobileMenu} />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
