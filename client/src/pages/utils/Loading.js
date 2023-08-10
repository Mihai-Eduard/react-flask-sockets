import React from "react";
import { CircularProgress } from "@mui/material";

const Loading = () => {
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
        <p style={{ alignSelf: "center" }}>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
