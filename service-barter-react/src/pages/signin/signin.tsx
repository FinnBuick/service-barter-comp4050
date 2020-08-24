import Typography from "@material-ui/core/Typography";
import firebase from "firebase";
import * as React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import styles from "./signin.scss";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "/home",
  tosUrl: "http://example.com/tos",
  privacyPolicyUrl: "http://example.com/privacy",
};

export const Signin = React.memo(() => (
  <div className={styles.content}>
    <Typography className={styles.signInTitle} variant="h2" align="center">
      Sign-in
    </Typography>
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  </div>
));
