import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Button, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { json, redirect, useFetcher } from "react-router-dom";
import { getToken } from "../../utils/token";

const createRoomRequestOptions = (token) => ({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

const joinRoomRequestOptions = (token, room_id) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    room_id: room_id,
  }),
});

const Dashboard = () => {
  const fetcher = useFetcher();
  const response = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";
  const [error, setError] = useState("");
  const roomIDInput = useRef(null);
  const [clicked, setClicked] = useState(0);

  useEffect(() => {
    if (response && "error" in response) setError(response["error"]);
  }, [response]);

  const createRoomHandler = () => {
    setClicked(1);
    fetcher.submit(
      { action: "create" },
      { method: "post", action: "/dashboard" },
    );
  };

  const joinRoomHandler = () => {
    setClicked(2);
    fetcher.submit(
      { action: "join", room_id: roomIDInput.current.value },
      { method: "post", action: "/dashboard" },
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <p>Dashboard</p>
            <div style={{ display: "flex" }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                style={{ width: "25%" }}
                disabled={isSubmitting}
                onClick={createRoomHandler}
              >
                Create room
              </Button>
              {isSubmitting && clicked === 1 && (
                <CircularProgress style={{ marginLeft: "1rem" }} />
              )}
            </div>
            <div style={{ marginTop: "3rem" }}>
              <div style={{ display: "flex" }}>
                <TextField
                  id="standard-name"
                  label="Room ID"
                  inputRef={roomIDInput}
                  InputProps={{
                    endAdornment: (
                      <Button
                        endIcon={<SendIcon />}
                        style={{ width: "100%" }}
                        disabled={isSubmitting}
                        onClick={joinRoomHandler}
                      >
                        Join room
                      </Button>
                    ),
                  }}
                />
                {isSubmitting && clicked === 2 && (
                  <CircularProgress style={{ marginLeft: "1rem" }} />
                )}
              </div>
              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "0rem",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

export async function dashboardActions({ request }) {
  try {
    const requestData = await request.formData();
    const action = requestData.get("action");
    if (action === "create") {
      const response = await fetch(
        "http://localhost:5000/api/room/create",
        createRoomRequestOptions(getToken()),
      );
      const data = await response.json();
      if (response.status === 200) return redirect(`/room/${data["room_id"]}`);
    }
    if (action === "join") {
      const room_id = requestData.get("room_id");
      const response = await fetch(
        "http://localhost:5000/api/room/join",
        joinRoomRequestOptions(getToken(), room_id),
      );
      console.log(room_id);
      const data = await response.json();
      if (response.status === 200) return redirect(`/room/${data["room_id"]}`);
      if (response.status === 404)
        return { error: "There is no room with that id." };
    }
  } catch (error) {
    console.log(error);
  }
  throw json({ message: "There was a server error." }, { status: 500 });
}
