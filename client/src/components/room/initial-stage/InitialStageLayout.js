import React, { useEffect } from "react";
import { roomActions } from "../../../store/room-slice";
import { useSocket } from "../../../context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { useSubmit } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import RoomIDContainer from "./RoomIDContainer";
import OwnerContainer from "./OwnerContainer";
import UsersContainer from "./UsersContainer";
import MessagesContainer from "./MessagesContainer";

const InitialStageLayout = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const room = useSelector((state) => state.room);
  const roomID = room["id"];
  const submit = useSubmit();

  useEffect(() => {
    try {
      console.log(`settings up the sockets for  room ${roomID}...`);
      socket.on(`room/${roomID}/messages`, (room) => {
        dispatch(roomActions.setRoom(room));
      });

      return () => {
        socket.off(`room/${roomID}/messages`);
      };
    } catch (error) {
      console.log(error);
    }
    submit({ status: 500 }, { method: "post", action: `/room/${roomID}` });
  }, [socket, dispatch, roomID, submit]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <RoomIDContainer roomID={roomID} />
        <OwnerContainer username={room["owner"].username} />
        <UsersContainer users={room["users"]} />
        <MessagesContainer messages={room["messages"]} roomID={roomID} />
      </Grid>
    </Container>
  );
};

export default InitialStageLayout;
