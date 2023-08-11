import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { useSocket } from "../../context/SocketProvider";

const Room = () => {
  const { socket } = useSocket();
  console.log(socket);
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            Dashboard
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Room;
