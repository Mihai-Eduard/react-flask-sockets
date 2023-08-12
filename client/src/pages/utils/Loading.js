import React from "react";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";

const Loading = ({text}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100vh",
      }}
    >
      <div style={{ width: "100vh", display: "flex", flexDirection: "column" }}>
        <CircularProgress style={{ alignSelf: "center" }} />
        <Typography style={{ alignSelf: "center" }}>{text || "Loading..."}</Typography>
      </div>
    </div>
  );
};

export default Loading;
