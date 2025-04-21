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
  import crypto from "crypto";
  import { saveKey } from "../db/KeyDB";
  import * as openpgp from 'openpgp';

const generateKeyPair = async () => {
  try {
    // Step 1: Generate the key pair using openpgp
    const { privateKey, publicKey } = await openpgp.generateKey({
      userIDs: [{ name: 'Test User', email: 'test@example.com' }], // Optional user info
      curve: 'ed25519', // You can choose between RSA, ECC (ed25519, secp256k1), etc.
      passphrase: '', // Optional: If you want a passphrase for the private key
    });

    console.log("Generated Public Key:", publicKey);
    console.log("Generated Private Key:", privateKey);

    // Save public and private keys or return them
    await saveKey("privateKey", privateKey);
    return publicKey;

  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error('Failed to generate keys');
  }
};

  

  const Signup = () => {
    const username = useInputValidation("");
    const email = useInputValidation("");
    const password = useStrongPassword();
    const [error, setError] = useState("");
  
    const dispatch = useDispatch();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      console.log("username", username.value);
      console.log("email", password.value); 
      const publicKeyBase64 = await generateKeyPair();
        console.log("publicKeyBase64", publicKeyBase64);

      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/v1/user/register",
          {
            username: username.value,
            email: email.value,
            password: password.value,
            publicKey: publicKeyBase64,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Signup data:", data);
  
        dispatch(
          login({
            user: {
              _id: data.data._id,
              username: data.data.username,
            },
            token: "",
            isAuthenticated: true,
          })
        );
  
        console.log("✅ Signup Successful:", data);
        // Optionally redirect
        // navigate("/dashboard");
      } catch (err) {
        console.error("❌ Signup Error:", err.response?.data?.message || err.message);
        setError(
          err.response?.data?.message || "Signup failed. Please try again."
        );
      }
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
          <Typography
            variant="h4"
            sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
          >
            Sign Up
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
              label="Email"
              margin="normal"
              variant="outlined"
              fullWidth
              type="email"
              value={email.value}
              onChange={email.changeHandler}
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
  
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    );
  };
  
  export default Signup;
  