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

    React.useEffect(() => {
      //TODO(jridey/alex): Update this with firebase user information
      setUser({
        user: "james",
        fetched: true,
        loggedIn: true,
      });
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  },
);
