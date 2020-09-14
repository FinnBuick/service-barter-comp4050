import { compareDesc, format, formatDistanceToNow } from "date-fns";
import firebase from "firebase";
import * as React from "react";

import { User } from "../../components/user/user_provider";

export type Favour = {
  id: string;
  title: string;
  cost: number;
  ownerUid: string;
  timestamp: firebase.firestore.Timestamp;
  roughLocation: string;
  description: string;
  actualLocation: string;
};

export type newFavour = {
  title: string;
  cost: number;
  street: string;
  suburb: string;
  description: string;
};

export class FavourService {
  private favoursDb?: firebase.firestore.CollectionReference;
  private user = firebase.auth().currentUser;
  newFavour = {
    title: "",
    cost: 0,
    street: "",
    suburb: "",
    description: "",
  };
  userMapping = new Map();

  constructor() {
    this.favoursDb = firebase.firestore().collection("favours");
  }

  getFavours = () => {
    this.favoursDb
      .doc(this.user.uid)
      .collection("favourList")
      .get()
      .then((value) => {
        const favourList = value.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Favour))
          .sort((f1, f2) =>
            compareDesc(f1.timestamp.toDate(), f2.timestamp.toDate()),
          );

        this.setState((state) => ({
          ...state,
          favourList,
        }));

        const getUsersPromises = favourList.map((favour) => {
          const ownerUid = favour.ownerUid;

          let promise: Promise<void | any> = Promise.resolve();
          if (!this.userMapping.has(ownerUid)) {
            promise = firebase
              .firestore()
              .collection("users")
              .doc(ownerUid)
              .get();
            promise.then((value) => {
              if (!value.exists) return;
              const user = value.data();
              this.state.userMapping.set(ownerUid, user);
            });
          }
          return promise;
        });
        Promise.all(getUsersPromises).then(() =>
          this.setState((state) => ({
            ...state,
            userMapping: new Map(this.state.userMapping),
          })),
        );
      });
  };

  createFavour = () => {
    const favour = {
      title: this.newFavour.title,
      ownerUid: this.user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      roughLocation: this.newFavour.suburb,
      description: this.newFavour.description,
      actualLocation: this.newFavour.street + ", " + this.newFavour.suburb,
      cost: this.newFavour.cost,
    } as Favour;

    const doc = this.favoursDb.doc(this.user.uid);
    doc.collection("favourList").add(favour);

    favour.timestamp = firebase.firestore.Timestamp.now();
    this.setState((state) => ({
      ...state,
      favourList: [favour, ...this.state.favourList],
    }));
  };
}
