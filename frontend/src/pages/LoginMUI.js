import { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

function LoginMUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setStatus(res.ok ? `✅ Welcome ${data.user?.name}` : `❌ ${data.detail}`);
    } catch {
      setStatus("❌ Server error");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            variant="outlined"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box mt={2} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ minWidth: "120px" }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
          {status && (
            <Typography mt={2} align="center" color="textSecondary">
              {status}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
}

export default LoginMUI;
