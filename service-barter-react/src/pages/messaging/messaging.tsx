/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Badge,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import ForwardIcon from "@material-ui/icons/Forward";
import MailIcon from "@material-ui/icons/Mail";
import classnames from "classnames";
import * as firebase from "firebase";
import * as React from "react";
import { Cookies, withCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import RSC from "react-scrollbars-custom";

import { ConfirmDialog } from "../../components/confirm_dialog/confirm_dialog";
import { UserPicker } from "../../components/user_picker/user_picker";
import {
  UserContext,
  UserContextProps,
} from "../../components/user/user_provider";
import styles from "./messaging.scss";

type Room = {
  id: string;
  messages: {
    userId: string;
    userName: string;
    timestamp: string;
    message: string;
  }[];
  users: string[];
  typing: string[];
};

type UserRooms = {
  id: string;
  name: string;
  avatar: string;
  newMessages: number;
};

class MessagingImpl extends React.Component<
  {
    cookies: Cookies;
  },
  {
    userDialogOpen: boolean;
    deleteDialogOpen: boolean;
    room?: Room;
    userRooms?: UserRooms[];
  }
> {
  static contextType = UserContext;

  private RoomCard = React.memo(({ room }: { room: UserRooms }) => {
    const onClick = () => this.newRoomSelected(room.id);
    const onDeleteClick = () => this.openDeleteDialog(room.id);

    return (
      <Card className={styles.room}>
        <ListItem button onClick={onClick}>
          <ListItemText primary={room.name} />
          {room.newMessages > 0 && (
            <ListItemIcon className={styles.notificationIcon}>
              <Badge color="primary" badgeContent={room.newMessages}>
                <MailIcon />
              </Badge>
            </ListItemIcon>
          )}
          <ListItemSecondaryAction>
            <IconButton onClick={onDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </Card>
    );
  });

  private database?: firebase.database.Database;
  private userContext: UserContextProps;
  private roomDeleteId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private roomListener?: any;
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props, context) {
    super(props, context);
    this.state = {
      userDialogOpen: false,
      deleteDialogOpen: false,
      userRooms: undefined,
      room: undefined,
    };
    this.userContext = context;
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.database = firebase.database();
    if (this.userContext.loggedIn) {
      this.getUserRooms();
    }
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      if (this.userContext.loggedIn) {
        this.getUserRooms();
      }
    }
  }

  render() {
    if (this.context?.fetched && !this.context?.loggedIn) {
      return <Redirect to="/signin" />;
    }

    return (
      <div className={styles.content}>
        <ConfirmDialog
          title="Are you sure you want to delete this room?"
          open={this.state.deleteDialogOpen}
          handleClose={this.closeDeleteDialog}
          onConfirm={this.roomDeleteConfirm}
        />
        <div className={styles.roomsWrapper}>
          <Typography>Rooms</Typography>
          <RSC noScrollX>
            {this.state.userRooms == null ? (
              <>
                <CircularProgress />
                <br />
              </>
            ) : this.state.userRooms.length === 0 ? (
              <Typography>
                There are no rooms, start by creating one!
              </Typography>
            ) : (
              <List>
                {this.state.userRooms.map((room) => (
                  <this.RoomCard key={room.id} room={room} />
                ))}
              </List>
            )}
            <Button
              variant="contained"
              color="primary"
              className={styles.createRoomButton}
              onClick={this.openUserDialog}
            >
              Create room
            </Button>
          </RSC>
          <UserPicker
            open={this.state.userDialogOpen}
            handleClose={this.closeUserDialog}
            onUserClick={this.userSelected}
          />
        </div>
        <div className={styles.messagesWrapper}>
          <Typography>Messages</Typography>
          <RSC noScrollX>
            <div className={styles.messages}>
              {this.state.room == null ? (
                <CircularProgress />
              ) : this.state.room.id === "empty" ? (
                <Typography>Please select a room</Typography>
              ) : (
                this.state.room.messages.map((message) => (
                  <Card
                    key={message.timestamp}
                    className={classnames(
                      styles.message,
                      message.userId === this.userContext.user.uid && styles.me,
                      message.userId !== this.userContext.user.uid &&
                        styles.you,
                    )}
                  >
                    <Typography>{message.message}</Typography>
                  </Card>
                ))
              )}
            </div>
          </RSC>
          <TextField
            className={styles.input}
            placeholder="Type a message..."
            onKeyDown={this.sendMessage}
            inputRef={this.inputRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={this.sendMessage}>
                    <ForwardIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    );
  }

  private openUserDialog = () =>
    this.setState((state) => ({ ...state, userDialogOpen: true }));

  private closeUserDialog = () =>
    this.setState((state) => ({ ...state, userDialogOpen: false }));

  private userSelected = (user: firebase.User) => {
    this.closeUserDialog();

    this.createRoom(user);
  };

  private openDeleteDialog = (roomId: string) => {
    this.roomDeleteId = roomId;
    this.setState((state) => ({ ...state, deleteDialogOpen: true }));
  };

  private closeDeleteDialog = () =>
    this.setState((state) => ({ ...state, deleteDialogOpen: false }));

  private roomDeleteConfirm = () => {
    this.closeDeleteDialog();
    this.deleteRoomSelected(this.roomDeleteId);
  };

  getUserRooms() {
    const user = this.userContext.user;
    this.database.ref(`/users/${user.uid}/rooms`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        this.setState((state) => ({
          ...state,
          userRooms: Object.values(snapshot.val()),
          room: state.room ?? {
            id: "empty",
            messages: [],
            users: [],
            typing: [],
          },
        }));

        // TODO(jridey): This doesn't properly take into account you could switch to another browser
        // Should probably be stored on firebase and fetched.
        // Disable since it cause issues with room notifications
        // this.newRoomSelected(this.props.cookies.get("lastRoomId"));
      } else {
        this.setState((state) => ({
          ...state,
          userRooms: [],
          room: {
            id: "empty",
            messages: [],
            users: [],
            typing: [],
          },
        }));
      }
    });
  }

  newRoomSelected = (roomId: string) => {
    this.setState((state) => ({ ...state, room: undefined }));
    this.lastRoomSelected(roomId);

    const user = this.userContext.user;
    this.database
      .ref(`/users/${user.uid}/rooms/${roomId}`)
      .update({ newMessages: 0 });

    const ref = this.database.ref(`/rooms/${roomId}`);

    ref.off("value", this.roomListener);
    this.roomListener = ref.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const room = snapshot.val() as Room;
        this.setState((state) => ({
          ...state,
          room: {
            id: room.id,
            typing: room.typing,
            users: room.users,
            messages: Object.values(room.messages || {}),
          },
        }));
      }
    });
  };

  lastRoomSelected = (roomId) => {
    this.props.cookies.set("lastRoomId", roomId);
  };

  deleteRoomSelected = (roomId: string) => {
    const ref = this.database.ref(`/rooms/${roomId}`);

    ref.once("value").then((value) => {
      for (const user of value.val().users) {
        this.database.ref(`/users/${user}/rooms/${roomId}`).remove();
      }

      ref.off("value", this.roomListener);
      ref.remove();

      this.setState((state) => ({
        ...state,
        userRooms: this.state.userRooms.filter((room) => room.id !== roomId),
        room: {
          id: "empty",
          messages: [],
          users: [],
          typing: [],
        },
      }));
    });
  };

  createRoom = (otherUser: firebase.User) => {
    const roomRef = this.database.ref().child("/rooms").push();
    const roomId = roomRef.key;
    const user = this.userContext.user;
    roomRef.set({
      id: roomId,
      messages: [],
      users: [user.uid, otherUser.uid],
      typing: [],
    } as Room);

    const roomName = `${user.displayName}, ${otherUser.displayName}`;
    const room = {
      id: roomId,
      name: roomName,
      avatar: "",
      newMessages: 0,
    };

    this.database.ref(`/users/${user.uid}/rooms/${roomId}`).set(room);
    this.database.ref(`/users/${otherUser.uid}/rooms/${roomId}`).set(room);

    this.newRoomSelected(roomId);
  };

  sendMessage = (e) => {
    if (e.key === undefined || e.key === "Enter") {
      const user = this.userContext.user;
      this.database.ref(`/rooms/${this.state.room.id}/messages`).push().set({
        userId: user.uid,
        userName: user.displayName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        message: this.inputRef.current.value,
      });
      this.inputRef.current.value = "";
    }
  };
}

export const Messaging = withCookies(MessagingImpl);
