import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import TopBar from "../../components/home/TopBar";
import SideBar from "../../components/home/SideBar";
import { Outlet } from "react-router-dom";

const SIDE_BAR_OPEN_WIDTH = 240;
const SIDE_BAR_CLOSE_WIDTH = 24;

const defaultTheme = createTheme();

export default function HomeLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar
          isSideBarOpen={isSideBarOpen}
          toggleSideBar={toggleSideBar}
          sideBarOpenWidth={SIDE_BAR_OPEN_WIDTH}
          sideBarCloseWidth={SIDE_BAR_CLOSE_WIDTH}
        />
        <SideBar
          isSideBarOpen={isSideBarOpen}
          toggleSideBar={toggleSideBar}
          sideBarOpenWidth={SIDE_BAR_OPEN_WIDTH}
        />
        <Box
          component="main"
          sx={{
            background: defaultTheme.palette.grey[100],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
