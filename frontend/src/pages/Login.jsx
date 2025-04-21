import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useInputValidation, useStrongPassword } from "6pp";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const username = useInputValidation("");
  const password = useStrongPassword();
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post("http://localhost:8000/api/v1/user/login", {
        identifier: username.value,
        password: password.value,
      },{
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Login data:", data.data.user);
      
      dispatch(login({
        user: {
          _id: data.data.user._id,
          username: data.data.user.username,
        },
        token: "",
        isAuthenticated: true,
      }));

      console.log("✅ Login Successful:", data);
      // Example: store token or redirect
      // localStorage.setItem("token", data.token);
      // navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/user/google";
  };

  return (
    <Container
      maxWidth="sm"
      component="main"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}>
          Login
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1rem",
          }}
        >
          <TextField
            required
            label="Username"
            margin="normal"
            variant="outlined"
            fullWidth
            value={username.value}
            onChange={username.changeHandler}
          />

          <TextField
            required
            label="Password"
            margin="normal"
            variant="outlined"
            fullWidth
            type="password"
            value={password.value}
            onChange={password.changeHandler}
          />

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Login
          </Button>

          <Button
            onClick={loginWithGoogle}
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login with Google
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
