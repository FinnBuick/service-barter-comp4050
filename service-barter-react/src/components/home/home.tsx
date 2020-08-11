import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as React from "react";

import styles from "./home.scss";

export const Home = React.memo(() => (
  <div className={styles.content}>
    <div className={styles.contentTitle}>
      <Typography variant="h3">Service Barter</Typography>
      <Typography variant="body1">
        Short subtle description of the website
      </Typography>
      <div className={styles.rootButton}>
        <Button variant="contained" color="primary">
          Sign up
        </Button>
      </div>
    </div>
    <div className={styles.contentBody}>
      <Typography variant="h5">
        List of recent favours (In your area)
      </Typography>
      <Grid container spacing={2} className={styles.grid}>
        <Grid container justify="center">
          {[0, 1, 2].map((value) => (
            <Grid key={value} item>
              <Paper elevation={3} className={styles.paper} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Typography variant="h5">
        List of recent favour history
      </Typography>
    </div>
  </div>
));
