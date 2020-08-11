import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
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
      <Typography>
        List of recent favours (In your area)
      </Typography>
      <Typography>
        List of recent favours history
      </Typography>
    </div>
  </div>
));
