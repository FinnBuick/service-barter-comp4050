import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../components/user/user_provider";
import styles from "./home.scss";

export const Home = React.memo(() => {
  const userContext = React.useContext(UserContext);

  return (
    <div className={styles.content}>
      <div className={styles.contentTitle}>
        <Typography variant="h3">Service Barter</Typography>
        <Typography variant="body1">
          Short subtle description of the website
        </Typography>
        {!userContext.loggedIn && (
          <div className={styles.rootButton}>
            <Button
              component={Link}
              to="/signin"
              variant="contained"
              color="primary"
            >
              Sign in
            </Button>
          </div>
        )}
      </div>
      <div className={styles.contentBody}>
        <Typography variant="h5">
          List of recent favours (In your area)
        </Typography>
        <Grid container className={styles.grid}>
          <Grid container justify="center">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
              <Grid key={value} item>
                <Paper elevation={3} className={styles.paper} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Typography variant="h5">List of recent favour history</Typography>
        <Grid container className={styles.grid}>
          <Grid container justify="center">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
              <Grid key={value} item>
                <Paper elevation={3} className={styles.paper} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
});
