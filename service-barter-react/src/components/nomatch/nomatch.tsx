import * as React from "react";
import styles from './nomatch.scss';

const reactLogo = require("./../../assets/img/react_logo.svg");

export const NoMatch = React.memo(() => (
  <div className={styles.content}>
    <h1>Page not found</h1>
  </div>
));
