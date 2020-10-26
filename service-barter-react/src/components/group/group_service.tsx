import firebase from "firebase";

import { User } from "../../components/user/user_provider";

export type Group = {
  id: string;
  memberUid: string;
  title: string;
  timestamp: firebase.firestore.Timestamp;
};

export type NewGroup = { title: string };

export class GroupService {
  private groupsDb?: firebase.firestore.CollectionReference;
  private userMapping = new Map<string, User>();

  constructor() {
    this.groupsDb = firebase.firestore().collection("groups");
  }

  public getGroups(): Promise<(Group & { member: User })[]> {
    return this.groupsDb
      .limit(50)
      .get()
      .then((value) => {
        console.log(value.docs);
        const groupList = value.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Group),
        );
        const getUsersPromises = groupList.map((group) => {
          const memberUid = group.memberUid;

          if (!this.userMapping.has(memberUid)) {
            return firebase
              .firestore()
              .collection("users")
              .doc(memberUid)
              .get()
              .then((value) => {
                if (!value.exists) return;
                const user = value.data() as User;
                this.userMapping.set(memberUid, user);
              });
          }
          return Promise.resolve();
        });

        return Promise.all(getUsersPromises).then(() => {
          return groupList.map((v) => ({
            ...v,
            member: this.userMapping.get(v.memberUid),
          }));
        });
      });
  }

  public createGroup(newGroup: NewGroup, memberUid: string): Group {
    const group = {
      title: newGroup.title,
      memberUid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    } as Group;

    this.groupsDb.doc().set(group);

    // Generate a fake random id, will eventually get replace by Firebase.
    group.id = Date.now().toString();
    return group;
  }
}
