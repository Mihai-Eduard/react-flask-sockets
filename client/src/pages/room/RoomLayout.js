import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { getToken } from "../../utils/token";
import { useSubmit } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/SocketProvider";
import { roomActions } from "../../store/room-slice";

const requestOptions = (token, text) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: text,
    }),
  };
};

const RoomLayout = () => {
  const [textMessage, setTextMessage] = useState("");
  const submit = useSubmit();
  const room = useSelector((state) => state.room);
  const roomID = room["id"];
  const numberOfMessages = room["messages"].length;
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      console.log(`settings up the sockets for  room ${roomID}...`);
      socket.on(`room/${roomID}/messages`, (room) => {
        dispatch(roomActions.setRoom(room));
        // scroll to the bottom
      });

      return () => {
        socket.off(`room/${roomID}/messages`);
      };
    } catch (error) {
      console.log(error);
    }
    submit({ status: 500 }, { method: "post", action: `/room/${roomID}` });
  }, [socket, dispatch, roomID, submit]);

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [scrollRef, numberOfMessages]);

  const sendMessageHandler = () => {
    fetch(
      `http://localhost:5000/api/room/${room["id"]}/message`,
      requestOptions(getToken(), textMessage),
    )
      .then((response) => {
        console.log(response);
        if (response.status !== 200) throw new Error(String(response.status));
      })
      .catch((error) => {
        console.log(error);
        submit(
          { status: error.message === 404 ? 404 : 500 },
          { method: "post", action: `/room/${room["id"]}` },
        );
      });
    setTextMessage("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>{`Room: ${room["id"]}`}</p>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <p>{`Owner: @${room["owner"].username}`}</p>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>Users:</p>
            {room["users"].map((user) => (
              <p key={user.id} style={{ margin: "0rem" }}>
                @{user.username}
              </p>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "30rem",
            }}
          >
            <p>Messages:</p>
            <div style={{ overflowY: "scroll", flexGrow: 1 }} ref={scrollRef}>
              {room["messages"].map((message) => (
                <p
                  key={message.id}
                >{`${message.sender.username}: ${message.text}`}</p>
              ))}
            </div>
            <TextField
              id="standard-name"
              value={textMessage}
              onChange={(event) => setTextMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessageHandler();
              }}
              InputProps={{
                endAdornment: (
                  <Button endIcon={<SendIcon />} onClick={sendMessageHandler} />
                ),
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomLayout;
