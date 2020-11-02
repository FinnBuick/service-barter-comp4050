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
  fcmTokens: string[];
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
        firebase.auth().onAuthStateChanged((firebaseUser) => {
          let user = null;
          if (firebaseUser) {
            user = {
              uid: firebaseUser.uid,
              photoURL: firebaseUser.photoURL,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              favourPoint: 0,
              address: "Macquarie Park, NSW Australia",
              skillList: [],
            } as User;

            const ref = firebase
              .firestore()
              .collection("users")
              .doc(firebaseUser.uid);
            ref.get().then((value) => {
              if (value.exists) {
                user = value.data();
                user.uid = firebaseUser.uid;
              } else {
                ref.set(user, { merge: true });
              }

              setUser({
                user,
                fetched: true,
                loggedIn: !!firebaseUser,
              });
            });

            ref.onSnapshot((doc) => {
              setUser({
                user: doc.data(),
                fetched: true,
                loggedIn: true,
              });
            });
          }
        }),
      [],
    );

    React.useEffect(() => {
      if (user.user?.uid) {
        const messaging = firebase.messaging();
        messaging
          .getToken({
            vapidKey:
              "BIbZhbP4glGt3HBPZg1jDdPWQyMJoqXuziqiO0v82vMK1PnMyUgbp2o24rlvapQa7hUg-TuRUHndfxxSE5icxJU",
          })
          .then((currentToken) => {
            if (currentToken) {
              firebase
                .firestore()
                .collection("users")
                .doc(user.user.uid)
                .update({
                  fcmTokens: firebase.firestore.FieldValue.arrayUnion(
                    currentToken,
                  ),
                });
            } else {
              // Show permission request.
              console.log(
                "No registration token available. Request permission to generate one.",
              );
              // Show permission UI.
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
          });

        messaging.onMessage((payload) => {
          console.log("onMessage: ", payload);
        });
      }
    }, [user]);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  },
);
