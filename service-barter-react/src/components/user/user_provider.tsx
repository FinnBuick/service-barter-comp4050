import firebase from "firebase";
import * as React from "react";

export type User = {
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
  favourPoint: number;
  address: string;
  skillList: string[];
};

export type UserContextProps = {
  user?: User;
  fetched: boolean;
  loggedIn: boolean;
};

export const UserContext = React.createContext<UserContextProps>({
  user: null,
  fetched: false,
  loggedIn: false,
});

export const UserProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState({
      user: null,
      fetched: false,
      loggedIn: false,
    });

    React.useEffect(
      () =>
        firebase.auth().onAuthStateChanged((user) => {
          let newUser = null;
          if (user) {
            newUser = {
              uid: user.uid,
              photoURL: user.photoURL,
              displayName: user.displayName,
              email: user.email,
              favourPoint: 0,
              address: "Macquarie Park, NSW Australia",
              skillList: [],
            } as User;

            firebase
              .firestore()
              .collection("users")
              .doc(user.uid)
              .set(newUser, { merge: true });
          }

          setUser({
            user: newUser,
            fetched: true,
            loggedIn: !!user,
          });
        }),
      [],
    );

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  },
);
