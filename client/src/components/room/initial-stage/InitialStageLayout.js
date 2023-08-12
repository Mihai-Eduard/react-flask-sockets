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

const InitialStageLayout = ({
  startRaceHandler,
  setIsRace,
  isSubmitting,
  error,
  setTotalTime,
}) => {
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
      socket.on(`room/${roomID}/activate`, (data) => {
        if (data["message"] === "Room started.") {
          setTotalTime(data["total_time"]);
          setIsRace(true);
        }
      });

      return () => {
        socket.off(`room/${roomID}/messages`);
        socket.off(`room/${roomID}/activate`);
      };
    } catch (error) {
      console.log(error);
    }
    submit({ status: 500 }, { method: "post", action: `/room/${roomID}` });
  }, [socket, dispatch, roomID, submit, setIsRace, setTotalTime]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <RoomIDContainer roomID={roomID} />
        <OwnerContainer username={room["owner"].username} />
        <UsersContainer
          users={room["users"]}
          startRaceHandler={startRaceHandler}
          isSubmitting={isSubmitting}
          error={error}
        />
        <MessagesContainer messages={room["messages"]} roomID={roomID} />
      </Grid>
    </Container>
  );
};

export default InitialStageLayout;
