import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../components/user/user_provider";
import styles from "./home.scss";

export const FavourDetails = React.memo(() => {
  const userContext = React.useContext(UserContext);

  return <div className={styles.content}></div>;
});
