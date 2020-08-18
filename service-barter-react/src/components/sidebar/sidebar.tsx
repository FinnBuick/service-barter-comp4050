import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import MessageIcon from "@material-ui/icons/Message";
import StoreIcon from "@material-ui/icons/Store";
import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./sidebar.scss";

export const Sidebar = React.memo(
  ({ open, setOpen }: { open: boolean; setOpen: (boolean) => void }) => {
    const closeDrawer = () => setOpen(false);

    return (
      <Drawer open={open}>
        <div
          className={styles.list}
          role="presentation"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/messaging">
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messaging" />
            </ListItem>
            <ListItem button component={Link} to="/store">
              <ListItemIcon>
                <StoreIcon />
              </ListItemIcon>
              <ListItemText primary="Store" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  },
);
