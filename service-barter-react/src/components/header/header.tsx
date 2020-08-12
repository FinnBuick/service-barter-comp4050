import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./header.scss";

export const Header = React.memo(
  ({ toggleSidebar: toggleDrawer }: { toggleSidebar: () => void }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

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
          <div>
            <div>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  },
);
