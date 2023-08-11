import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const UsersContainer = ({ users }) => {
  return (
    <Grid item xs={4}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p>Users:</p>
        {users.map((user) => (
          <p key={user.id} style={{ margin: "0rem" }}>
            @{user.username}
          </p>
        ))}
      </Paper>
    </Grid>
  );
};

export default UsersContainer;
