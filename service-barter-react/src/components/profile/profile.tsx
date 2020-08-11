import * as React from "react";

import styles from "./profile.scss";

export const Profile = React.memo(() => (
  <div className={styles.content}>
    <h1>Profile page</h1>
  </div>
));
