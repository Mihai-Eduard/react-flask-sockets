import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { usePopover } from "../../hooks/use-popover";
import picture from "../../assets/default profile picture.png";
import { AccountPopover } from "./AccountPopover";

const StyledTopBar = styled(MuiAppBar, {
  shouldForwardProp: (props) => props !== "props",
})(({ theme, props }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(props.open && {
    marginLeft: props.openWidth,
    width: `calc(100% - ${props.openWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({
  isSideBarOpen,
  toggleSideBar,
  sideBarOpenWidth,
  sideBarCloseWidth,
}) => {
  const accountPopover = usePopover();

  return (
    <StyledTopBar
      position="absolute"
      props={{ open: isSideBarOpen, openWidth: sideBarOpenWidth }}
    >
      <Toolbar
        sx={{
          pr: sideBarCloseWidth,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSideBar}
          sx={{
            marginRight: "36px",
            ...(isSideBarOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          RaceApp
        </Typography>
        <IconButton color="inherit" style={{ marginRight: "1rem" }}>
          <Badge badgeContent={0} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Avatar
          onClick={accountPopover.handleOpen}
          ref={accountPopover.anchorRef}
          sx={{
            cursor: "pointer",
            height: 40,
            width: 40,
          }}
          src={picture}
        />
        <AccountPopover
          anchorEl={accountPopover.anchorRef.current}
          open={accountPopover.open}
          onClose={accountPopover.handleClose}
        />
      </Toolbar>
    </StyledTopBar>
  );
};

export default TopBar;
