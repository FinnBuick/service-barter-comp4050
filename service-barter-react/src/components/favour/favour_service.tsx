import firebase from "firebase";

import { User } from "../../components/user/user_provider";

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
  group: string;
};

export type NewFavour = {
  title: string;
  cost: number;
  street: string;
  suburb: string;
  description: string;
  group: string;
};

export class FavourService {
  private favoursDb?: firebase.firestore.CollectionReference;
  private userMapping = new Map<string, User>();

  constructor() {
    this.favoursDb = firebase.firestore().collection("favours");
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

  public createFavour(newFavour: NewFavour, ownerUid: string): Favour {
    const favour = {
      title: newFavour.title,
      ownerUid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      roughLocation: newFavour.suburb,
      description: newFavour.description,
      actualLocation: `${newFavour.street}, ${newFavour.suburb}`,
      cost: newFavour.cost,
      group: newFavour.group;
    } as Favour;

    this.favoursDb.doc().set(favour);

    // Generate a fake random id, will eventually get replace by Firebase.
    favour.id = Date.now().toString();
    favour.timestamp = firebase.firestore.Timestamp.now();
    return favour;
  }

  public requestFavour(favourId: string, requestUid: string): void {
    this.favoursDb.doc(favourId).update({ requestUid });
  }
}
