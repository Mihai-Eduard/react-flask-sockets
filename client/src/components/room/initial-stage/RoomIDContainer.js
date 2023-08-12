import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";

const RoomIdContainer = ({ roomID }) => {
  const copyIDHandler = () => {
    navigator.clipboard.writeText(roomID);
  };

  return (
    <Grid item xs={8}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
        }}
      >
        <p>{`Room ID: ${roomID}`}</p>
        <Tooltip title="Copy Room ID!">
          <IconButton onClick={copyIDHandler}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </Grid>
  );
};

export default RoomIdContainer;
