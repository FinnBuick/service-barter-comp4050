import firebase from "firebase";
import * as React from "react";

export const UserContext = React.createContext({
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
        firebase.auth().onAuthStateChanged((user) =>
          setUser({
            user,
            fetched: true,
            loggedIn: !!user,
          }),
        ),
      [],
    );

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  },
);
