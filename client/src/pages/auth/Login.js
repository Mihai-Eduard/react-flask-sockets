import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { json, Link, redirect, useFetcher } from "react-router-dom";
import { Alert, Collapse } from "@mui/material";

const defaultTheme = createTheme();

const requestOptions = (email, password) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  }),
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const fetcher = useFetcher();
  const response = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (response) {
      setError(response.message);
    }
  }, [response]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(
      { email: email, password: password },
      { method: "post", action: "/login" },
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connect to Your Account
          </Typography>
          <Collapse in={error !== ""}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Collapse>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link variant="body2" to="/reset-password">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" to="/signup">
                  {"Don't have an account? Sign up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;

export async function loginAction({ request }) {
  try {
    const credentials = await request.formData();
    const response = await fetch(
      "http://localhost:5000/api/login",
      requestOptions(credentials.get("email"), credentials.get("password")),
    );
    const data = await response.json();
    if (response.status === 200) return redirect("/signup");
    if (response.status === 400) return data;
  } catch (error) {
    console.log(error);
  }
  throw json({ message: "There was a server error." }, { status: 500 });
}
