import * as React from "react";
import styles from './home.scss';
import Button from '@material-ui/core/Button';

const reactLogo = require("./../../assets/img/react_logo.svg");

export const Home = React.memo(() => (
  <div className={styles.content}>
    <div className={styles.contentTitle}>
      <h1>SERVICE BARTER COMP4050</h1>
      <p>Short subtle description of the website</p>
      <div className={styles.rootButton}>
        <Button variant="contained" color="primary" style={{marginRight:'10px'}}>
          Login
        </Button>
        <Button variant="contained" color="primary">
          Sign up
        </Button>
      </div>
    </div>
  </div>
));
