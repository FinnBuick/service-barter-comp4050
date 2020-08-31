import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import RoomIcon from "@material-ui/icons/Room";
import * as firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../components/user/user_provider";
import styles from "./profile.scss";

export const EditProfile = React.memo(() => {
  const userContext = React.useContext(UserContext);

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
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
            >
              Change Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/profile"
            >
              Cancel
            </Button>
          </div>
          <div className={styles.profileBody}>
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
        </div>
      )}
    </div>
  );
});
