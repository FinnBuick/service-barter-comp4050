import firebase from "firebase";
import * as React from "react";

type UserContextProps = {
  user?: firebase.User;
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
          if (user) {
            firebase.firestore().collection("users").doc(user.uid).set(
              {
                photoURL: user.photoURL,
                displayName: user.displayName,
                email: user.email,
                favourPoint: 0,
                skillList: [],
              },
              { merge: true },
            );
          }

          setUser({
            user,
            fetched: true,
            loggedIn: !!user,
          });
        }),
      [],
    );

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  },
);
