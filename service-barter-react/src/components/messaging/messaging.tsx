import { CardActionArea, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ForwardIcon from "@material-ui/icons/Forward";
import * as firebase from "firebase";
import * as React from "react";
import { Redirect } from "react-router-dom";

import { UserContext } from "../user/user_provider";
import styles from "./messaging.scss";

type Room = {
  id: string;
  messages: {
    user: string;
    userAvatar: string;
    timestamp: string;
    message: string;
  }[];
  typing: string[];
};

type UserRooms = {
  id: string;
  name: string;
  avatar: string;
};

export class Messaging extends React.Component<
  Record<string, unknown>,
  {
    room?: Room;
    userRooms?: UserRooms[];
  }
> {
  static contextType = UserContext;

  private RoomCard = React.memo(({ room }: { room: UserRooms }) => {
    const onClick = () => this.newRoomSelected(room.id);
    return (
      <Card className={styles.room} onClick={onClick}>
        <CardActionArea>
          <Typography>Room: {room.name}</Typography>
        </CardActionArea>
      </Card>
    );
  });

  private database?: firebase.database.Database;
  private userContext: any;
  private roomListener?: any;

  constructor(props, context) {
    super(props, context);
    this.state = {
      userRooms: undefined,
      room: undefined,
    };
    this.userContext = context;
  }

  componentDidMount() {
    this.database = firebase.database();
    this.getUserRooms();
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      this.getUserRooms();
    }
  }

  render() {
    if (this.userContext?.fetched && !this.userContext?.loggedIn) {
      return <Redirect to="/login" />;
    }

    return (
      <div className={styles.content}>
        <div className={styles.roomsWrapper}>
          <Typography>Rooms</Typography>
          {this.state.userRooms == null ? (
            <CircularProgress />
          ) : this.state.userRooms.length === 0 ? (
            <Typography>There are no rooms, start by creating one!</Typography>
          ) : (
            <>
              {this.state.userRooms.map((room) => (
                <this.RoomCard key={room.id} room={room} />
              ))}
              <Button
                variant="contained"
                color="primary"
                className={styles.createRoomButton}
                onClick={this.createRoom}
              >
                Create room
              </Button>
            </>
          )}
        </div>
        <div className={styles.messagesWrapper}>
          <Typography>Messages</Typography>
          <div className={styles.messages}>
            {this.state.room === undefined ? (
              <CircularProgress />
            ) : (
              this.state.room.messages.map((message) => (
                <Card key={message.timestamp} className={styles.message}>
                  <Typography>{message.message}</Typography>
                </Card>
              ))
            )}
          </div>
          <TextField
            className={styles.input}
            placeholder="Type a message..."
            onKeyDown={this.sendMessage}
            InputProps={{
              endAdornment: <ForwardIcon onClick={this.sendMessage} />,
            }}
          />
        </div>
      </div>
    );
  }

  getUserRooms() {
    const username = this.userContext.user;
    this.database.ref(`/users/${username}/rooms`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        this.setState((state) => ({
          ...state,
          userRooms: Object.values(snapshot.val()),
        }));
      }
    });
  }

  newRoomSelected = (roomId: string) => {
    this.setState((state) => ({ ...state, room: undefined }));

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
            messages: Object.values(room.messages || {}),
          },
        }));
      }
    });
  };

  createRoom = () => {
    const roomRef = this.database.ref().child("/rooms").push();
    roomRef.set({
      id: roomRef.key,
      typing: [],
      messages: [],
    });

    const username = this.userContext.user;
    this.database.ref(`/users/${username}/rooms`).push().set({
      id: roomRef.key,
      name: username,
      avatar: "",
    });
  };

  sendMessage = (e) => {
    if (e.key === undefined || e.key === "Enter") {
      const username = this.userContext.user;
      this.database.ref(`/rooms/${this.state.room.id}/messages`).push().set({
        user: username,
        userAvatar: "",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        message: e.target.value,
      });
      e.target.value = "";
    }
  };
}
