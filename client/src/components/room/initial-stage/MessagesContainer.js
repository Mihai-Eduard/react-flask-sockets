import React, { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Grid from "@mui/material/Grid";
import { getToken } from "../../../utils/token";
import { useSubmit } from "react-router-dom";

const postMessageRequestOptions = (token, text) => {
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

const MessagesContainer = ({ messages, roomID }) => {
  const [textMessage, setTextMessage] = useState("");
  const numberOfMessages = messages.length;
  const submit = useSubmit();
  const scrollRef = useRef(null);

  const sendMessageHandler = () => {
    fetch(
      `http://localhost:5000/api/room/${roomID}/message`,
      postMessageRequestOptions(getToken(), textMessage),
    )
      .then((response) => {
        console.log(response);
        if (response.status !== 200) throw new Error(String(response.status));
      })
      .catch((error) => {
        console.log(error);
        submit(
          { status: error.message === 404 ? 404 : 500 },
          { method: "post", action: `/room/${roomID}` },
        );
      });
    setTextMessage("");
  };

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [scrollRef, numberOfMessages]);

  return (
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
          {messages.map((message) => (
            <p
              key={message.id}
              style={{ margin: "0.5rem" }}
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
  );
};

export default MessagesContainer;
