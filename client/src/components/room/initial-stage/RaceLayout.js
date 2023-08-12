import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketProvider";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getToken } from "../../../utils/token";
import { Tooltip } from "@mui/material";

const clickPointRequestOptions = (token) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const RaceLayout = () => {
  const { socket } = useSocket();
  const room = useSelector((state) => state.room);
  const roomID = room["id"];
  const [points, setPoints] = useState([]);
  const [finishedUsers, setFinishedUsers] = useState([]);

  useEffect(() => {
    socket.on(`room/${roomID}/game`, (data) => {
      setPoints((points) => {
        const newPoints = [...points];
        newPoints.push({ x: data["x"], y: data["y"], id: data["id"] });
        console.log(data["x"], data["y"]);
        return newPoints;
      });
    });
    socket.on(`room/${roomID}/finish`, (user) => {
      console.log(user);
      setFinishedUsers((finishedUsers) => {
        const newFinishedUsers = [...finishedUsers];
        newFinishedUsers.push(user);
        return newFinishedUsers;
      });
    });

    return () => {
      socket.off(`room/${roomID}/game`);
      socket.off(`room/${roomID}/finish`);
    };
  }, [socket, roomID, setPoints]);

  const onClickHandler = (point_id) => {
    fetch(
      `http://localhost:5000/api/room/${roomID}/click/${point_id}`,
      clickPointRequestOptions(getToken()),
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setPoints((points) => {
      return points.filter((point) => point.id !== point_id);
    });
  };

  return (
    <Grid container>
      <Grid item xs={10} style={{ marginLeft: "1rem" }}>
        <p style={{ textAlign: "center" }}>Click as fast as you can!</p>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            margin: "0rem",
            padding: "0rem",
            position: "relative",
          }}
        >
          <>
            {points.map((point) => (
              <IconButton
                key={point.id}
                style={{
                  width: "3rem",
                  height: "3rem",
                  position: "absolute",
                  left: `min(${point.x}%, calc(100% - 3rem))`,
                  top: `min(${point.y}%, calc(100% - 3rem))`,
                }}
                color="success"
                onClick={() => onClickHandler(point.id)}
              >
                <HighlightOffIcon />
              </IconButton>
            ))}
          </>
        </Paper>
      </Grid>
      <Grid item xs={1.5} style={{ marginLeft: "1rem" }}>
        <p style={{ textAlign: "center" }}>Leaderboard</p>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            margin: "0rem",
            padding: "0rem",
            position: "relative",
            overflowY: "auto",
            height: "fit-content",
          }}
        >
          <>
            {finishedUsers.map((user, index) => (
              <Tooltip
                title={`${user["score"]} seconds`}
                arrow
                key={user["user_id"]}
              >
                <p style={{ margin: "0.5rem" }}>{`${index + 1}. @${
                  user.username
                }`}</p>
              </Tooltip>
            ))}
          </>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RaceLayout;
