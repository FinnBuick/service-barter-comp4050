import {
  CircularProgress,
  Collapse,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { VerifiedUserSharp } from "@material-ui/icons";
import * as React from "react";
import { Redirect } from "react-router-dom";
import RSC from "react-scrollbars-custom";

import { AcceptPicker } from "../../components/accept_picker/accept_picker";
import { FavourCard } from "../../components/favour_card/favour_card";
import {
  Favour,
  FavourService,
  Requester,
} from "../../components/favour/favour_service";
import { User, UserContext } from "../../components/user/user_provider";
import styles from "./favours.scss";

export const Favours = React.memo(() => {
  const userContext = React.useContext(UserContext);

  if (userContext.fetched && !userContext.loggedIn) {
    return <Redirect to="/signin" />;
  }

  const [completedFavour, setCompletedFavour] = React.useState(undefined);
  const [tabValue, setTabValue] = React.useState(0);
  const [favourList, setFavourList] = React.useState(null);

  const [acceptPickerState, setAcceptPickerState] = React.useState({
    open: false,
    requestedUsers: [],
    selectedFavour: null,
  });

  const [favourMap, setFavourMap] = React.useState(
    new Map<string, (Requester & { owner: User })[]>(),
  );

  const favourServicer = new FavourService();
  React.useEffect(() => {
    if (!userContext.user?.uid) {
      return;
    }

    favourServicer
      .getUserFavours(userContext.user.uid, tabValue)
      .then((favourListI) => {
        const favourList = favourListI as (Favour & { acceptUser: User })[];

        const promisesRequests = favourList.map((favour) =>
          favourServicer.getFavourRequesters(favour).then((requesters) => {
            setFavourMap(new Map(favourMap.set(favour.id, requesters)));
          }),
        );

        const promisesAccepts = favourList.map((favour) =>
          favour.acceptUid
            ? favourServicer
                .getUserCached(favour.acceptUid)
                .then((user) => (favour.acceptUser = user))
            : Promise.resolve(),
        );
        Promise.all([promisesRequests, promisesAccepts]).then(() =>
          setFavourList(favourList),
        );
      });
  }, [userContext, tabValue, completedFavour]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const favourCardClick = (favour: Favour) => {
    setAcceptPickerState({
      open: true,
      requestedUsers: favourMap.get(favour.id).map((request) => request.owner),
      selectedFavour: favour,
    });
  };

  const favourCardComplete = (favour: Favour) => {
    favourServicer.completeFavour(favour);
    setCompletedFavour(favour.id);
  };

  const acceptPickerClose = () => {
    setAcceptPickerState({
      open: false,
      requestedUsers: [],
      selectedFavour: null,
    });
  };

  const acceptPickerClick = (user: User) => {
    favourServicer.acceptFavour(acceptPickerState.selectedFavour, user);
    setAcceptPickerState({
      open: false,
      requestedUsers: [],
      selectedFavour: null,
    });

    // Just need something that changes
    setCompletedFavour(user.uid);
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
          <Tab label="Completed favours" />
        </Tabs>
      </Paper>
      <RSC noScrollX>
        <Grid className={styles.cardsWrapper} container spacing={2}>
          {favourList == null ? (
            <Grid item xs={6} md={4} zeroMinWidth>
              <CircularProgress />
              <br />
            </Grid>
          ) : favourList.length === 0 && tabValue == 0 ? (
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
                    acceptUser={favour.acceptUser}
                    onClick={favourCardClick}
                    onComplete={favourCardComplete}
                    requests={favourMap.get(favour.id)?.length || 0}
                    viewRequests={true}
                    completedFavour={favour.state}
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
