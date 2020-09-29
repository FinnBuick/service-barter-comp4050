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

import { AcceptPicker } from "../../components/accept_picker/accept_picker";
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
  const [favourList, setFavourList] = React.useState(null);

  const [acceptPickerState, setAcceptPickerState] = React.useState({
    open: false,
    requestedUsers: [],
  });

  const favourServicer = new FavourService();
  React.useEffect(() => {
    if (!userContext.user?.uid) {
      return;
    }

    favourServicer
      .getUserFavours(userContext.user.uid)
      .then((favourList) => setFavourList(favourList));
  }, [userContext]);

  // TODO: Change between different types of favours
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const favourCardClick = () => {
    // TODO: Actually get the list of requested users
    const randomUser = {
      address: "Macquarie Park, NSW Australia",
      displayName: "Test",
      email: "test@gmail.com",
      favourPoint: 0,
      photoURL: null,
      skillList: [],
      uid: "5MF4vSP8OMe9jEql25BuxSAva9u2",
    };

    setAcceptPickerState({ open: true, requestedUsers: [randomUser] });
  };

  const acceptPickerClose = () => {
    setAcceptPickerState({ open: false, requestedUsers: [] });
  };

  // TODO: Change state of favour to accepted, set accepted user
  const acceptPickerClick = () => {
    setAcceptPickerState({ open: false, requestedUsers: [] });
  };

  return (
    <div className={styles.content}>
      <AcceptPicker
        users={acceptPickerState.requestedUsers}
        open={acceptPickerState.open}
        handleClose={acceptPickerClose}
        onUserClick={acceptPickerClick}
      />
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Your favours" />
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
                    user={userContext.user}
                    onClick={favourCardClick}
                    requests={4}
                    viewRequests={true}
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
