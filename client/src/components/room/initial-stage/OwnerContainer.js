import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const OwnerContainer = ({ username }) => {
  return (
    <Grid item xs={4}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <p>{`Owner: @${username}`}</p>
      </Paper>
    </Grid>
  );
};

export default OwnerContainer;
