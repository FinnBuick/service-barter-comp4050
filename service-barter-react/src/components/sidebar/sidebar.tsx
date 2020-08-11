import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MessageIcon from "@material-ui/icons/Message";
import StoreIcon from "@material-ui/icons/Store";
import classNames from "classnames";
import * as React from "react";

import styles from "./sidebar.scss";

export const Sidebar = React.memo(
  ({ open, setOpen }: { open: boolean; setOpen: (boolean) => void }) => {
    const closeDrawer = () => setOpen(false);

    return (
      <Drawer open={open}>
        {/* anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}> */}
        <div
          className={classNames(styles.list, {
            // ["fullList"]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
        >
          <List>
            <ListItem button>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messaging" />
            </ListItem>
            <ListItem button>
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
