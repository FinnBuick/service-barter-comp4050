import { Avatar } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../user/user_provider";
import styles from "./header.scss";

export const Header = React.memo(
  ({ toggleSidebar: toggleDrawer }: { toggleSidebar: () => void }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const userContext = React.useContext(UserContext);

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    const handleListKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        setOpen(false);
      }
    };

    const logout = () =>
      firebase
        .auth()
        .signOut()
        .then(() => {
          location.reload();
        });

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }

      prevOpen.current = open;
    }, [open]);

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={styles.title}>
            Service Barter
          </Typography>
          <div className={styles.search}>
            <div className={styles.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: styles.inputRoot,
                input: styles.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>

          {!userContext.loggedIn && (
            <div className={styles.loggedOutBtnGroup}>
              <Button
                className={styles.loggedOutBtn}
                component={Link}
                to="/signin"
                variant="contained"
              >
                Sign in
              </Button>
            </div>
          )}

          <div className={styles.pointsCounter}>
            {userContext.loggedIn && (
              <Typography>Points: {userContext.user.favourPoint}</Typography>
            )}
          </div>

          <div>
            <div className={styles.accountIcon}>
              {userContext.loggedIn && (
                <Avatar
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  src={userContext.user.photoURL || "invalid"}
                  alt={userContext.user.displayName}
                  onClick={handleToggle}
                />
              )}
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem
                            component={Link}
                            to="/profile"
                            onClick={handleClose}
                          >
                            Profile
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/favours"
                            onClick={handleClose}
                          >
                            Favours
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/report"
                            onClick={handleClose}
                          >
                            Report
                          </MenuItem>
                          <MenuItem component={Link} to="/" onClick={logout}>
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  },
);
