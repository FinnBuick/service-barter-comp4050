import firebase, { firestore } from "firebase";

import { User } from "../../components/user/user_provider";

export type Requester = {
  id: string;
  ownerUid: string;
};

export enum FavourState {
  PENDING,
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
  skills: string;
  actualLocation: string;
  groupId: string;
  groupTitle: string;
  state: FavourState;
  review: string;
  stars: number;
};

export type NewFavour = {
  title: string;
  cost: number;
  street: string;
  suburb: string;
  skills: string;
  description: string;
  groupId: string;
  groupTitle: string;
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
  private requestsDb?: firebase.firestore.CollectionReference;
  private userMapping = new Map<string, User>();
  private database?: firebase.database.Database;

  constructor() {
    this.favoursDb = firebase.firestore().collection("favours");
    this.requestsDb = firebase.firestore().collection("requests");
    this.database = firebase.database();
  }

  private appendCachedUsers<T>(
    userList: (T & { ownerUid: string })[],
  ): Promise<(T & { owner: User })[]> {
    const getUsersPromises = userList.map((favour) => {
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
      return userList.map((v) => ({
        ...v,
        owner: this.userMapping.get(v.ownerUid),
      }));
    });
  }

  public getFavours(): Promise<(Favour & { owner: User })[]> {
    return this.favoursDb
      .orderBy("timestamp", "desc")
      .limit(50)
      .get()
      .then((value) =>
        this.appendCachedUsers<Favour>(
          value.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Favour)),
        ),
      );
  }

  public getUserFavours(
    ownerUid: string,
    filterState?: FavourState,
  ): Promise<Favour[]> {
    let filteredResults = this.favoursDb
      .orderBy("timestamp", "desc")
      .where("ownerUid", "==", ownerUid);

    if (filterState !== undefined) {
      filteredResults = filteredResults.where("state", "==", filterState);
    }

    return filteredResults
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
      groupTitle: newFavour.groupTitle,
      skills: newFavour.skills,
      state: FavourState.PENDING,
      review: "",
      stars: 0,
    } as Favour;

    this.favoursDb.doc().set(favour);

    // Generate a fake random id, will eventually get replace by Firebase.
    favour.id = Date.now().toString();
    favour.timestamp = firebase.firestore.Timestamp.now();
    return favour;
  }

  public requestFavour(
    favour: Favour,
    requestUser: User,
    ownerUser: User,
  ): void {
    this.createRoomForRequest(requestUser, ownerUser);

    this.requestsDb
      .doc(favour.id)
      .collection("requests")
      .doc(requestUser.uid)
      .set({ exists: true });
  }

  getFavourRequesters(
    favour: Favour,
  ): Promise<(Requester & { owner: User })[]> {
    return this.requestsDb
      .doc(favour.id)
      .collection("requests")
      .get()
      .then((value) =>
        this.appendCachedUsers<Requester>(
          value.docs.map((doc) => ({ id: doc.id, ownerUid: doc.id })),
        ),
      );
  }

  acceptFavour(favour: Favour, user: User) {
    return this.favoursDb
      .doc(favour.id)
      .update({ acceptUid: user.uid, state: FavourState.ACCEPTED });
  }

  completeFavour(favour: Favour) {
    return this.favoursDb.doc(favour.id).update({ state: FavourState.DONE });
  }

  getUserCached(userUid: string): Promise<User> {
    return this.appendCachedUsers<unknown>([{ ownerUid: userUid }]).then(
      (values) => {
        if (values.length === 0) {
          throw new Error(`User not found with ${userUid}`);
        }
        return values[0].owner;
      },
    );
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

  public setReview = (favour: Favour, rev: string) => {
    this.favoursDb.doc(favour.id).update({ review: rev });
  };
}
