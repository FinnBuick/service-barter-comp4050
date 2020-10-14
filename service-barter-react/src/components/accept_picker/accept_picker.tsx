import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import * as React from "react";

import { User } from "../user/user_provider";

export const AcceptPicker = React.memo(
  ({
    users,
    open,
    handleClose,
    onUserClick,
  }: {
    users: User[];
    open: boolean;
    handleClose: () => void;
    onUserClick: (user: User) => void;
  }) => {
    const UserListItem = React.memo(({ user }: { user: User }) => {
      const onClick = () => onUserClick(user);

      return (
        <ListItem key={user.displayName}>
          <ListItemAvatar>
            <Avatar src={user.photoURL || "invalid"} alt={user.displayName} />
          </ListItemAvatar>
          <ListItemText primary={user.displayName} />
          <ListItemSecondaryAction>
            <Button onClick={onClick}>Accept request</Button>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Favour requests received from</DialogTitle>
        <List>
          {users.map((user) => (
            <UserListItem key={user.displayName} user={user} />
          ))}
        </List>
      </Dialog>
    );
  },
);
