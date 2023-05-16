import { atom, useRecoilState } from "recoil";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import AritmeticIcon from "@mui/icons-material/CalculateOutlined";
import DashIcon from "@mui/icons-material/DashboardOutlined";
import SwapIcon from "@mui/icons-material/SwapHorizOutlined";
import DictionaryIcon from "@mui/icons-material/MenuBook";
import SplitsIcon from "@mui/icons-material/AltRoute";

import { drawerWidth } from "../../constants";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export const drawerState = atom({
  key: "drawerState",
  default: false,
});

const DrawerStyled = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
      // width: theme.spacing( 7 ),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(0),
        // width: theme.spacing( 9 ),
      },
    }),
  },
}));

function Drawer({ open }) {
  // const setDrawerState = useSetRecoilState(drawerState)
  const [drawerStateValue, setDrawerState] = useRecoilState(drawerState);
  const { search: queryParams } = useLocation();

  const location = useLocation();

  const [selectedIndex, setSelectedIndex] = useState(
    location.pathname.replace("/", "")
  );

  useEffect(() => {
    setSelectedIndex(location.pathname.replace("/", ""));
  }, [location.pathname]);

  const handleListItemClick = (event, index) => {
    // setSelectedIndex(index);
    setDrawerState(false);
  };

  function toggleDrawer() {
    setDrawerState((currentState) => !currentState);
  }

  return (
    <DrawerStyled variant="permanent" open={open || drawerStateValue}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {categories.map(({ id, children }, index) => (
          <Box key={`${id}-${index}`}>
            {id.length > 0 && (
              <ListItem sx={{ py: 2, px: 3 }}>
                <ListItemText sx={{ fontWeight: "bold" }}>
                  <Typography
                    color="inherit"
                    sx={{ ml: 1, fontSize: 15, fontWeight: 500 }}
                  >
                    {id}
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
            {children.map(({ id: childId, icon, to }) => (
              <ListItem key={`${id}-${childId}`}>
                <ListItemButton
                  selected={
                    selectedIndex === childId || location.pathname === to
                  }
                  onClick={(event) => handleListItemClick(event, childId)}
                  component={Link}
                  to={`${to}${queryParams}`}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </DrawerStyled>
  );
}

const categories = [
  {
    id: "",
    children: [
      {
        id: "Dashboard",
        icon: <DashIcon />,
        to: "/",
      },
      {
        id: "Gods",
        icon: <TempleHinduIcon />,
        to: "/gods",
      },
    ],
  },
  {
    id: "Entities",
    children: [
      {
        id: "Create",
        icon: <AritmeticIcon />,
        to: "/entity/create",
      },
    ],
  },
  {
    id: "Uploaders",
    children: [
      {
        id: "Sthotram",
        icon: <AritmeticIcon />,
        to: "/uploaders/sthotram",
      },
    ],
  },
  {
    id: "Extras",
    children: [
      {
        id: "Transliterate",
        icon: <SwapIcon />,
        to: "/transliterate",
      },
      {
        id: "Sanscript Dictionary",
        icon: <DictionaryIcon />,
        to: "/sans-dict",
      },
      {
        id: "Sanscript Splits",
        icon: <SplitsIcon />,
        to: "/sans-splits",
      },
      {
        id: "GraphEditor",
        icon: <AritmeticIcon />,
        to: "/editor",
      },
    ],
  },
];

export default Drawer;
