import firebase from "firebase";

import { User } from "../../components/user/user_provider";

export enum FavourState {
  PENDING = 1,
  ACCEPTED,
  DONE,
}

export type Favour = {
  id: string;
  title: string;
  cost: number;
  ownerUid: string;
  acceptUid: string;
  timestamp: firebase.firestore.Timestamp;
  roughLocation: string;
  description: string;
  actualLocation: string;
  state: FavourState;
};

export type NewFavour = {
  title: string;
  cost: number;
  street: string;
  suburb: string;
  description: string;
};

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

export class FavourService {
  private favoursDb?: firebase.firestore.CollectionReference;
  private userMapping = new Map<string, User>();
  private database?: firebase.database.Database;

  constructor() {
    this.favoursDb = firebase.firestore().collection("favours");
    this.database = firebase.database();
  }

  public getFavours(): Promise<(Favour & { owner: User })[]> {
    return this.favoursDb
      .orderBy("timestamp", "desc")
      .limit(50)
      .get()
      .then((value) => {
        const favourList = value.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Favour),
        );

        const getUsersPromises = favourList.map((favour) => {
          const ownerUid = favour.ownerUid;

          if (!this.userMapping.has(ownerUid)) {
            return firebase
              .firestore()
              .collection("users")
              .doc(ownerUid)
              .get()
              .then((value) => {
                if (!value.exists) return;
                const user = value.data() as User;
                this.userMapping.set(ownerUid, user);
              });
          }
          return Promise.resolve();
        });

        return Promise.all(getUsersPromises).then(() => {
          return favourList.map((v) => ({
            ...v,
            owner: this.userMapping.get(v.ownerUid),
          }));
        });
      });
  }

  public getUserFavours(ownerUid: string): Promise<Favour[]> {
    return this.favoursDb
      .orderBy("timestamp", "desc")
      .where("ownerUid", "==", ownerUid)
      .get()
      .then((value) =>
        value.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Favour)),
      );
  }

  public createFavour(newFavour: NewFavour, ownerUid: string): Favour {
    const favour = {
      title: newFavour.title,
      ownerUid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      roughLocation: newFavour.suburb,
      description: newFavour.description,
      actualLocation: `${newFavour.street}, ${newFavour.suburb}`,
      cost: newFavour.cost,
      state: FavourState.PENDING,
    } as Favour;

    this.favoursDb.doc().set(favour);

    // Generate a fake random id, will eventually get replace by Firebase.
    favour.id = Date.now().toString();
    favour.timestamp = firebase.firestore.Timestamp.now();
    return favour;
  }

  public requestFavour(
    favourId: string,
    requestUser: User,
    ownerUser: User,
  ): void {
    this.createRoomForRequest(requestUser, ownerUser);
    const requestUid = requestUser.uid;
    this.favoursDb.doc(favourId).update({ requestUid });
  }

  private createRoomForRequest = (requestUser: User, otherUser: User) => {
    const roomRef = this.database.ref().child("/rooms").push();
    const roomId = roomRef.key;
    roomRef.set({
      id: roomId,
      messages: [],
      users: [requestUser.uid, otherUser.uid],
      typing: [],
    } as Room);

    const roomName = `${requestUser.displayName}, ${otherUser.displayName}`;
    const room = {
      id: roomId,
      name: roomName,
      avatar: "",
    };

    this.database.ref(`/users/${requestUser.uid}/rooms/${roomId}`).set(room);
    this.database.ref(`/users/${otherUser.uid}/rooms/${roomId}`).set(room);

    this.sendRequestMessage(requestUser, roomId);
  };

  private sendRequestMessage = (senderUser: User, requestRoomId: string) => {
    this.database
      .ref(`/rooms/${requestRoomId}/messages`)
      .push()
      .set({
        userId: senderUser.uid,
        userName: senderUser.displayName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        message: `There is a request from the user: ${senderUser.displayName}`,
      });
  };
}
