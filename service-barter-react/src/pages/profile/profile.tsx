import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import RoomIcon from "@material-ui/icons/Room";
import * as React from "react";

import { UserContext } from "../../components/user/user_provider";
import styles from "./profile.scss";

export const Profile = React.memo(() => {
  const userContext = React.useContext(UserContext);

  const resetPassword = () =>
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        location.reload();
      });
  return (
    <div className={styles.content}>
      {userContext.user && (
        <div className={styles.profile}>
          <Typography
            variant="h5"
            style={{ display: "inline-block", marginLeft: "30px" }}
          >
            {userContext.user.displayName}
          </Typography>
          <Typography
            variant="subtitle2"
            style={{ display: "inline-block", marginLeft: "20px" }}
          >
            Macquarie Park, NSW Australia
          </Typography>
          <RoomIcon />
          <div className={styles.settingButtons}>
            <Button variant="contained" color="primary" onClick={resetPassword}>
              Reset Password
            </Button>
          </div>
          <div className={styles.profileBody}>
            <div>
              <div style={{ display: "inline-block" }}>
                <Typography variant="h6">Email address</Typography>
                <Typography variant="h6">Favour points</Typography>
              </div>
              <div style={{ display: "inline-block", marginLeft: "30px" }}>
                <Typography variant="h6" style={{ color: "#0066ff" }}>
                  {userContext.user.email}
                </Typography>
                <Typography variant="h6" style={{ color: "#0066ff" }}>
                  0
                </Typography>
              </div>
            </div>
            <Paper elevation={6} style={{ marginTop: "50px" }}>
              <div className={styles.infoBox}>
                <Typography variant="h5">History</Typography>
                <Typography variant="subtitle1">Contents</Typography>
              </div>
            </Paper>
            <Paper elevation={6} style={{ marginTop: "30px" }}>
              <div className={styles.infoBox}>
                <Typography variant="h5">Reviews</Typography>
                <Typography variant="subtitle1">Contents</Typography>
              </div>
            </Paper>
          </div>
        </div>
      )}
    </div>
  );
});
