import * as React from "react";
import styles from './home.scss';

const reactLogo = require("./../../assets/img/react_logo.svg");

export const Home = React.memo(() => (
  <div className={styles.content}>
    <h1>Hello World!</h1>
    <p>Foo to the barz</p>
    <img src={reactLogo.default} height="480" />
  </div>
));
