import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";

const isAdmin = false;
const AdminLogin = () => {
  const [password, setPassword] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Login Attempt:", {  password });
    // Add authentication logic here
  };
  if(isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <Container maxWidth="sm" component="main" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}>
          Admin Login
        </Typography>
        <form style={{ display: "flex", flexDirection: "column", width: "100%", gap: "1rem" }} onSubmit={handleSubmit}>
          <TextField required label="Password" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
