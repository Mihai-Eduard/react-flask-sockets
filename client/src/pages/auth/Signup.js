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

const requestOptions = (username, email, password1, password2) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: username,
    email: email,
    password: password1,
    confirm_password: password2,
  }),
});

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const response = fetcher.data;

  useEffect(() => {
    if (response) {
      setError(response.message);
    }
  }, [response]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(
      {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      },
      { method: "post", action: "/signup" },
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
            Create your account!
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
              id="username"
              label="Username"
              name="username"
              autoComplete="text"
              autoFocus
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              value={password1}
              onChange={(event) => {
                setPassword1(event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="current-password"
              value={password2}
              onChange={(event) => {
                setPassword2(event.target.value);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              Sign up
            </Button>
            <Grid container>
              <Grid item>
                <Link variant="body2" to="/login">
                  {"Already have an account? Log in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Signup;

export async function signupAction({ request }) {
  try {
    const credentials = await request.formData();
    const response = await fetch(
      "http://localhost:5000/api/signup",
      requestOptions(
        credentials.get("username"),
        credentials.get("email"),
        credentials.get("password1"),
        credentials.get("password2"),
      ),
    );
    const data = await response.json();
    if (response.status === 200) return redirect("/reset-password");
    if (response.status === 400) return data;
  } catch (error) {
    console.log(error);
  }
  throw json({ message: "There was a server error." }, { status: 500 });
}
