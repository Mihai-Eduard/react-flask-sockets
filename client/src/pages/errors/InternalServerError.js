import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

export default function InternalServerError() {
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
            <Typography variant="h1">500</Typography>
            <Typography variant="h6">A server error has occurred.</Typography>
            <Link to="/">
              <Button variant="contained">Back Home</Button>
            </Link>
          </Grid>
          <Grid xs={6} item={true}>
            <img
              src="https://img.freepik.com/free-vector/computer-technology-isometric-icon-server-room-digital-device-set-element-design-pc-laptop_39422-1026.jpg?w=1060&t=st=1691530304~exp=1691530904~hmac=525f44247b7d805d9deff99aebe8aae7c584e1d55b906777164ca2f25b0dd919"
              alt="man"
              height="300rem"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
