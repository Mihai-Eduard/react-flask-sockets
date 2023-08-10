import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";

const Settings = (props) => {
  const userDetails = useSelector((state) => state.userDetails);

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
            <div>
              <p>Settings</p>
              <p>id: {userDetails["id"]}</p>
              <p>email: {userDetails["email"]}</p>
              <p>username: {userDetails["username"]}</p>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
