import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { VisuallyHiddenInput } from "../components/style/StyleComponenet.jsx";
import {useFileHandler, useInputValidation, useStrongPassword} from "6pp"

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const name = useInputValidation("");
  const email = useInputValidation("");
  const password = useStrongPassword();  
  const bio = useInputValidation("");

  const AvatarHandler = useFileHandler('single');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
  };
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/user/google";
  };



  return (
    <Container maxWidth="sm" component="main" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        
        <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold", cursor: "pointer", mb: 2 }}>
          {isLogin ? "Login" : "Register"}
        </Typography>

        <form style={{ display: "flex", flexDirection: "column", width: "100%", gap: "1rem" }} onSubmit={handleSubmit}>
          
          {!isLogin && (
            <Stack sx={{ position: "relative", alignItems: "center" }}>
              <Avatar sx={{ width: "100px", height: "100px" }} src={AvatarHandler.preview}/>
              {
                AvatarHandler.error && <Typography variant="caption" sx={{ color: "red" }}>{AvatarHandler.error}</Typography>
              }
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  backgroundColor: "#1976d2",
                  ":hover": { backgroundColor: "#1565c0" },
                  color: "#fff",
                }}
                component="label"
                
              >
                <CameraAltIcon />
                <VisuallyHiddenInput type="file"  onChange={AvatarHandler.changeHandler} />
              </IconButton>
            </Stack>
          )}

          <TextField required label="Username" margin="normal" variant="outlined" fullWidth value={name.value} onChange={name.changeHandler} />
          {!isLogin && <TextField required label="Email" margin="normal" variant="outlined" fullWidth type="email" value={email.value} onChange={email.changeHandler} />}
          <TextField required label="Password" margin="normal" variant="outlined" fullWidth type="password" value={password.value} onChange={password.changeHandler} />
          {
            !isLogin && password.error && <Typography variant="caption" sx={{ color: "red" }}>{password.error}</Typography>
          }
          {!isLogin && <TextField label="Bio" margin="normal" variant="outlined" fullWidth value={bio.value} onChange={bio.changeHandler} />}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {isLogin ? "Login" : "Register"}
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="text" color="primary" onClick={() => setIsLogin(false)}>
                  Register
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="text" color="primary" onClick={() => setIsLogin(true)}>
                  Login
                </Button>
              </>
            )}
          </Typography>
          <div>
      <h1>Login</h1>
       (
        <button
          onClick={loginWithGoogle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Login with Google
        </button>
      )
    </div>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
