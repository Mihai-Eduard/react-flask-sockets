import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import * as React from "react";
import { SideBarList } from "./SideBarList";

const StyledSideBar = styled(MuiDrawer, {
  shouldForwardProp: (props) => props !== "props",
})(({ theme, props }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: props.openWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!props.open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 56,
    }),
  },
}));

const SideBar = ({ isSideBarOpen, toggleSideBar, sideBarOpenWidth }) => {
  return (
    <StyledSideBar
      variant="permanent"
      props={{ open: isSideBarOpen, openWidth: sideBarOpenWidth }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleSideBar}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <SideBarList />
      </List>
    </StyledSideBar>
  );
};

export default SideBar;
