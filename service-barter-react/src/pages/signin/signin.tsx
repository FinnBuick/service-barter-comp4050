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

export const Signin = React.memo(() => {
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleInvalid = () => setInvalid(true);
  const handleValid = () => setInvalid(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setInvalid(false);
  };
  const resetPassword = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        handleClose();
        handleValid();
        setSnackbarOpen(true);
      })
      .catch((err) => {
        handleInvalid();
      });
  };

  return (
    <div className={styles.content}>
      <Typography className={styles.signInTitle} variant="h2" align="center">
        Sign-in
      </Typography>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Reset Password
      </Button>
      <Dialog
        className={styles.dialogs}
        id="emailForm"
        open={open}
        onClose={handleClose}
        disableBackdropClick={true}
        aria-describedby="simple-modal-description"
      >
        <DialogTitle>
          Place your email here
          <CancelIcon style={{ float: "right" }} onClick={handleClose} />
        </DialogTitle>
        <DialogContent>
          <TextField
            error
            autoFocus
            margin="dense"
            inputRef={(el) => (this.fv = el)}
            required
            fullWidth
            helperText={invalid && "Invalid Email"}
          />
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                resetPassword(this.fv.value);
              }}
            >
              Send Email
            </Button>
          </div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity="success"
            >
              A password reset email has been sent to your email, {"Email"}
            </MuiAlert>
          </Snackbar>
        </DialogContent>
      </Dialog>
    </div>
  );
});
