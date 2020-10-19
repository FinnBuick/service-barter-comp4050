import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import * as firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../components/user/user_provider";
import styles from "./report.scss";

export const Report = React.memo(() => {
  const userContext = React.useContext(UserContext);
  const [newUserData, setNewUserData] = React.useState({
    name: "",
    email: "",
    category: "",
    description: "",
  });

  React.useEffect(() => {
    if (!userContext.user) {
      return;
    }
  }, [userContext]);

  const onChange = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    firebase.firestore().collection("users").doc(userContext.user.uid).update({
      displayName: newUserData.name,
      email: newUserData.email,
    });
  };

  return (
    <div className={styles.content}>
      {userContext.user && (
        <div className={styles.report}>
          <Typography
            variant="h4"
            style={{ marginLeft: "30px", textAlign: "center" }}
          >
            Report an issue
          </Typography>
          <div className={styles.reportInfo}>
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Name
              </Typography>
              <TextField
                className={styles.textField}
                name="name"
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
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Category
              </Typography>
              <TextField
                className={styles.textField}
                name="email"
                // defaultValue={userContext.user.email}
                onChange={(e) => onChange(e)}
              />
            </div>
          </div>
          <div className={styles.reportContent}>
            <Typography
              variant="h6"
              style={{ display: "inline-block", marginLeft: "30px" }}
            >
              Description
            </Typography>
            <TextField
              name="description"
              multiline
              rows={9}
              variant="outlined"
              onChange={onChange}
              style={{ marginTop: "19px", marginLeft: "30px", width: "800px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
