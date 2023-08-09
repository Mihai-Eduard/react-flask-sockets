import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6} item={true}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">
              The page you’re looking for does not exist.
            </Typography>
            <Link to="/">
              <Button variant="contained">Back Home</Button>
            </Link>
          </Grid>
          <Grid xs={6} item={true}>
            <img
              src="https://img.freepik.com/free-vector/businessman-working-with-computer-office_1262-19738.jpg?w=740&t=st=1691529947~exp=1691530547~hmac=a601df424361fad01664b87992dff8c7f46ac8ac5ffd881ac89f01ab40b2adc9"
              alt="man"
              height="300rem"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
