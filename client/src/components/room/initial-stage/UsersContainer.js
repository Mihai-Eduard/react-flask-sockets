import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";

const UsersContainer = ({ users, startRaceHandler, isSubmitting, error }) => {
  const userID = useSelector((state) => state.userDetails.id);
  const owner = useSelector((state) => state.room.owner.id);

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
      {userID === owner && (
        <>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={startRaceHandler}
            disabled={isSubmitting}
          >
            Start race!
          </Button>
          {error && (
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          )}
        </>
      )}
    </Grid>
  );
};

export default UsersContainer;
