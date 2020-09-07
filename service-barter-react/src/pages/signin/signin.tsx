import { Snackbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import MuiAlert from "@material-ui/lab/Alert";
import firebase from "firebase";
import * as React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { UserContext } from "../../components/user/user_provider";
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
const userContext = React.useContext(UserContext);

const [snackbarOpen, setSnackbarOpen] = React.useState(false);
const resetPassword = (form) =>
  firebase
    .auth()
    .sendPasswordResetEmail(form.email.value)
    .then(() => {
      setSnackbarOpen(true);
    });
const handleSnackbarClose = () => setSnackbarOpen(false);
const openPasswordResetDialog = false;
const passwordResetDialogClose = () => {
  this.setState({ openFavourDialog: false });
};
const passwordResetDialog = () => (
  <Dialog
    className={styles.dialogs}
    open={openPasswordResetDialog}
    onClose={passwordResetDialogClose}
    disableBackdropClick={true}
    aria-describedby="simple-modal-description"
  >
    <DialogTitle>
      Place your email here
      <CancelIcon
        style={{ float: "right" }}
        onClick={passwordResetDialogClose}
      />
    </DialogTitle>
    <DialogContent>
      <form>
        <TextField
          autoFocus
          margin="dense"
          name="subEmail"
          required
          fullWidth
        />
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={this.form}>
            Send Email
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
export const Signin = React.memo(() => (
  <div className={styles.content}>
    <Typography className={styles.signInTitle} variant="h2" align="center">
      Sign-in
    </Typography>
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  </div>
));
