import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import RoomIcon from "@material-ui/icons/Room";
import * as firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../components/user/user_provider";
import styles from "./edit_profile.scss";

export const EditProfile = React.memo(() => {
  const userContext = React.useContext(UserContext);
  const [newData, setNewData] = React.useState({
    name: null,
    address: null,
    email: null,
  });

  if (userContext.user && newData.name === null) {
    setNewData({
      name: userContext.user.displayName,
      address: userContext.user.address,
      email: userContext.user.email,
    });
  }

  const onChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    firebase.firestore().collection("users").doc(userContext.user.uid).update({
      displayName: newData.name,
      address: newData.address,
      email: newData.email,
    });
  };

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
            {userContext.user.address}
          </Typography>
          <RoomIcon />
          <div className={styles.settingButtons}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={onSubmit}
              component={Link}
              to="/profile"
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
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Name
              </Typography>
              <TextField
                className={styles.textField}
                name="name"
                defaultValue={userContext.user.displayName}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Address
              </Typography>
              <TextField
                className={styles.textField}
                name="address"
                defaultValue={userContext.user.address}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Email address
              </Typography>
              <TextField
                className={styles.textField}
                name="email"
                defaultValue={userContext.user.email}
                onChange={(e) => onChange(e)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
