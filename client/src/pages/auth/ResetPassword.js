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

import { json, Link, useFetcher } from "react-router-dom";
import { Alert, Collapse } from "@mui/material";

const defaultTheme = createTheme();

const requestOptions = (email) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
  }),
});

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const fetcher = useFetcher();
  const response = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";
  const [successful, setSuccessful] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(
      { email: email },
      { method: "post", action: "/reset-password" },
    );
  };

  useEffect(() => {
    if (response && response["message"] && response["status"]) {
      if (response["status"] === 400) {
        setError(response.message);
        setSuccessful("");
      }
      if (response["status"] === 200) {
        setSuccessful(response.message);
        setError("");
      }
    }
  }, [response]);

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
            Reset your password!
          </Typography>
          <Collapse in={error !== "" && successful === ""}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Collapse>
          <Collapse in={successful !== "" && error === ""}>
            <Alert severity="success">{successful}</Alert>
          </Collapse>
          <Typography component="p" variant="p">
            You will be sent a link to reset the password.
          </Typography>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              Send email
            </Button>
            <Grid container>
              <Grid item xs>
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

export default ResetPassword;

export async function resetPasswordAction({ request }) {
  try {
    const email = (await request.formData()).get("email");
    const response = await fetch(
      "http://localhost:5000/api/reset-password",
      requestOptions(email),
    );
    const data = await response.json();
    if (response.status === 200 || response.status === 400)
      return { status: response.status, message: data.message };
  } catch (error) {
    console.log(error);
  }
  throw json({ message: "There was a server error." }, { status: 500 });
}
