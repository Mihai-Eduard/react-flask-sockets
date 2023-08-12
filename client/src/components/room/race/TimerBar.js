import React from "react";
import Box from "@mui/material/Box";
import { LinearProgress } from "@mui/material";
import Typography from "@mui/material/Typography";

function TimerBar({ currentTime, totalTime }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Box sx={{ width: "50%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={
            currentTime !== undefined && totalTime !== undefined
              ? 100 - (100.0 * (totalTime - currentTime)) / totalTime
              : 100
          }
        />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {currentTime !== undefined
            ? `${currentTime} seconds remaining`
            : "timer"}
        </Typography>
      </Box>
    </Box>
  );
}
export default TimerBar;
