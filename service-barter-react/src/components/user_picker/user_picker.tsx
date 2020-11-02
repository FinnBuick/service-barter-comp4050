import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import * as firebase from "firebase";
import * as React from "react";

import { UserContext } from "../user/user_provider";
import styles from "./user_picker.scss";
export const UserPicker = React.memo(
  ({
    open,
    handleClose,
    onUserClick,
  }: {
    open: boolean;
    handleClose: () => void;
    onUserClick: (user: firebase.User) => void;
  }) => {
    const UserListItem = React.memo(({ user }: { user: firebase.User }) => {
      const onClick = () => onUserClick(user);

      return (
        <ListItem button onClick={onClick} key={user.displayName}>
          <ListItemAvatar>
            <Avatar src={user.photoURL || "invalid"} alt={user.displayName} />
          </ListItemAvatar>
          <ListItemText primary={user.displayName} />
        </ListItem>
      );
    });

    const [users, setUsers] = React.useState([]);

    const userContext = React.useContext(UserContext);

    React.useEffect(() => {
      firebase
        .firestore()
        .collection("users")
        .get()
        .then((users) => {
          setUsers(
            users.docs
              .map((doc) => ({ uid: doc.id, ...doc.data() }))
              .filter((user) => user.uid !== userContext.user?.uid),
          );
        });
    }, [userContext]);

    return (
      <Dialog
        classes={{ paper: styles.paper }}
        onClose={handleClose}
        open={open}
      >
        <DialogTitle>Pick a user to a send a message to</DialogTitle>
        <List>
          {users.map((user) => (
            <UserListItem key={user.displayName} user={user} />
          ))}
        </List>
      </Dialog>
    );
  },
);
