import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./signup.scss";

export const Signup = React.memo(() => (
  <div className={styles.content}>
    <h1>Sign-up page</h1>
    <form className={styles.finline} id="userReg">
      <label htmlFor="fullname">Full Name:</label>
      <input type="text" name="fullname" />
      <label htmlFor="location">Location:</label>
      <input type="text" name="location" />
      <label htmlFor="username">Username:</label>
      <input type="text" name="username" />
      <label htmlFor="email">Email:</label>
      <input type="text" name="email" />
      <label htmlFor="password">Password:</label>
      <input type="text" name="password" />
      <label htmlFor="cpassword">Confirm Password:</label>
      <input type="text" name="cpassword" />
      <Button component={Link} to="/signup" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  </div>
));
