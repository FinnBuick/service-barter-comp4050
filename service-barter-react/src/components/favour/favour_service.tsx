import { compareDesc } from "date-fns";
import firebase from "firebase";

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

export type NewFavour = {
  title: string;
  cost: number;
  street: string;
  suburb: string;
  description: string;
};

export class FavourService {
  private favoursDb?: firebase.firestore.CollectionReference;
  private userMapping = new Map<string, User>();

  constructor() {
    this.favoursDb = firebase.firestore().collection("favours");
  }

  public getFavours(userUid: string): Promise<(Favour & { owner: User })[]> {
    return this.favoursDb
      .doc(userUid)
      .collection("favourList")
      .get()
      .then((value) => {
        const favourList = value.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Favour))
          .sort((f1, f2) =>
            compareDesc(f1.timestamp.toDate(), f2.timestamp.toDate()),
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

  public createFavour(newFavour: NewFavour, ownerUid: string): Favour {
    const favour = {
      title: newFavour.title,
      ownerUid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      roughLocation: newFavour.suburb,
      description: newFavour.description,
      actualLocation: `${newFavour.street}, ${newFavour.suburb}`,
      cost: newFavour.cost,
    } as Favour;

    const doc = this.favoursDb.doc(ownerUid);
    doc.collection("favourList").add(favour);

    // Generate a fake random id, will eventually get replace by Firebase.
    favour.id = Date.now().toString();
    favour.timestamp = firebase.firestore.Timestamp.now();
    return favour;
  }
}
