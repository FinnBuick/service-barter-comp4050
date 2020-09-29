import {
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import * as React from "react";
import { Redirect } from "react-router-dom";
import RSC from "react-scrollbars-custom";

import { FavourCard } from "../../components/favour_card/favour_card";
import { FavourService } from "../../components/favour/favour_service";
import { UserContext } from "../../components/user/user_provider";
import styles from "./favours.scss";

export const Favours = React.memo(() => {
  const userContext = React.useContext(UserContext);

  if (userContext.fetched && !userContext.loggedIn) {
    return <Redirect to="/signin" />;
  }

  const [tabValue, setTabValue] = React.useState(0);
  const [favourList, setFavourList] = React.useState([]);

  const favourServicer = new FavourService();
  React.useEffect(() => {
    if (!userContext.user?.uid) {
      return;
    }

    favourServicer
      .getUserFavours(userContext.user.uid)
      .then((favourList) => setFavourList(favourList));
  }, [userContext]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className={styles.content}>
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Pending favours" />
          <Tab label="Accepted favours" />
          <Tab label="Done favours" />
        </Tabs>
      </Paper>
      <RSC noScrollX>
        <Grid className={styles.cardsWrapper} container spacing={2}>
          {favourList == null ? (
            <Grid item xs={6} md={4} zeroMinWidth>
              <CircularProgress />
              <br />
            </Grid>
          ) : favourList.length === 0 ? (
            <Grid item xs={6} md={4} zeroMinWidth>
              <Typography>
                There are no favours, start by creating one!
              </Typography>
            </Grid>
          ) : (
            <>
              {favourList.map((favour) => (
                <Grid key={favour.id} item xs={6} md={4} zeroMinWidth>
                  <FavourCard
                    favour={favour}
                    user={favour.owner}
                    onClick={this.favourCardClick}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </RSC>
    </div>
  );
});
