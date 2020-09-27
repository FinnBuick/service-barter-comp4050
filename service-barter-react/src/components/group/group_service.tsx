import firebase from "firebase";

import { User } from "../../components/user/user_provider";

export type Group = {
  id: string;
  title: string;
};

export type NewGroup = { title: string };

export class GroupService {
  private groupsDb?: firebase.firestore.CollectionReference;
  private userMapping = new Map<string, User>();

  constructor() {
    this.groupsDb = firebase.firestore().collection("groups");
  }

  public createGroup(newGroup: NewGroup, ownerUid: string): Group {
    const group = {
      title: newGroup.title,
    } as Group;

    this.groupsDb.doc().set(group);

    // Generate a fake random id, will eventually get replace by Firebase.
    group.id = Date.now().toString();
    return group;
  }
}
