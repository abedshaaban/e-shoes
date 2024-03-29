import "./Header.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Googleimg from "../Images/google.png";
// mui
import { styled, useTheme } from "@mui/material/styles";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// firebase
import { logOut, signInWithGoogle } from "../Functions";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import { Badge } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const [UserState, setUserState] = useState(Boolean);

  const [BagItems, setBagItems] = useState(0);

  function updateUserState() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState(true);
      } else {
        // User is signed out
        setUserState(false);
        setBagItems(0);
      }
    });
  }

  function logOutOfApp() {
    logOut();
    updateUserState();
    handleDrawer();
  }

  function signInToApp() {
    signInWithGoogle();
    updateUserState();
    handleDrawer();
  }

  const bagRef = collection(
    db,
    "users",
    auth.currentUser ? auth.currentUser.email : "guest",
    "bag"
  );

  useEffect(() => {
    onSnapshot(bagRef, (snapshot) => {
      // ...
      if (auth.currentUser) {
        setBagItems(snapshot.size);
      }
    });
    console.log("we are moving");
  });

  return (
    <header className="header" onLoad={updateUserState}>
      <div className="header_div_logo">
        <Link to="/" className="header_link">
          {/* <img className="header_div_logo_img" src="" alt="logo" /> */}
          <span>logo</span>
        </Link>
      </div>

      <div className="header_div_right_side">
        {!UserState ? (
          <button
            onClick={signInWithGoogle}
            className="header_div_right_side_btn"
          >
            Sign-in
            <img src={Googleimg} alt="google" className="google_img" />
          </button>
        ) : null}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => {
            navigate("cart");
          }}
        >
          <Badge
            color="primary"
            badgeContent={BagItems}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <ShoppingBagOutlinedIcon />
          </Badge>
        </IconButton>

        <Box onLoad={updateUserState}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            open={open}
            sx={{
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
              },
            }}
            variant="persistent"
            anchor="right"
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawer}>
                {theme.direction === "rtl" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <Link to="/" onClick={handleDrawer} className="header_link">
                <ListItem button key="home">
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>
            </List>
            {UserState ? (
              <List onClick={logOutOfApp}>
                <ListItem button key="logout">
                  <ListItemText primary="logout" />
                </ListItem>
              </List>
            ) : (
              <List onClick={signInToApp}>
                <ListItem button key="sign-in">
                  <ListItemText>
                    <span className="list_item">
                      sign-in
                      <img
                        src={Googleimg}
                        alt="google"
                        className="google_img"
                      />
                    </span>
                  </ListItemText>
                </ListItem>
              </List>
            )}
            <Divider />
          </Drawer>
        </Box>
      </div>
    </header>
  );
}
