import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const RoomIdContainer = ({ roomID }) => {
  return (
    <Grid item xs={8}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p>{`Room ID: ${roomID}`}</p>
      </Paper>
    </Grid>
  );
};

export default RoomIdContainer;
