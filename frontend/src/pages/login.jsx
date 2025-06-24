import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  keyframes,
} from "@mui/material";

// ✨ Define a simple fade-in and slide animation
const fadeSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 360,
          animation: `${fadeSlideIn} 0.8s ease-out`,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#1565c0" },
            }}
          >
            Log In
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginForm;
