import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import RoomIcon from "@material-ui/icons/Room";
import * as firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";

import { UserContext } from "../../components/user/user_provider";
import styles from "./edit_profile.scss";

export const EditProfile = React.memo(() => {
  const userContext = React.useContext(UserContext);
  const [newUserData, setNewUserData] = React.useState({
    name: "",
    address: "",
    email: "",
    skillList: [],
  });

  React.useEffect(() => {
    if (!userContext.user) {
      return;
    }

    setNewUserData({
      name: userContext.user.displayName,
      address: userContext.user.address,
      email: userContext.user.email,
      skillList: userContext.user.skillList,
    });
  }, [userContext]);

  const onChange = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    firebase.firestore().collection("users").doc(userContext.user.uid).update({
      displayName: newUserData.name,
      address: newUserData.address,
      email: newUserData.email,
      skillList: newUserData.skillList,
    });
  };

  /* Tag input logic */
  const handleTagAddition = (tag) => {
    setNewUserData({
      ...newUserData,
      skillList: [...newUserData.skillList, tag.text],
    });
  };

  const handleTagDelete = (tag) => {
    setNewUserData({
      ...newUserData,
      skillList: newUserData.skillList.filter((skill) => skill !== tag.text),
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
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Skills
              </Typography>
              <ReactTags
                name="skillList"
                classNames={{
                  tags: styles.tags,
                  tagInput: `${styles.tagInput} MuiInputBase-root MuiInput-underline`,
                  tagInputField: `${styles.tagInputField} MuiInputBase-input`,
                  selected: styles.selected,
                  tag: `${styles.tag} MuiTypography-subtitle2`,
                  remove: styles.remove,
                  suggestions: styles.suggestions,
                  activeSuggestion: styles.activeSuggestion,
                }}
                tags={newUserData.skillList.map((skill, i) => {
                  return {
                    id: `${i}`,
                    text: skill,
                  };
                })}
                handleAddition={handleTagAddition}
                handleDelete={handleTagDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
