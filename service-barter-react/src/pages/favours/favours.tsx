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
import {
  Favour,
  FavourService,
  Requester,
} from "../../components/favour/favour_service";
import { ReviewDialog } from "../../components/review_dialog/review_dialog";
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

  const [reviewDialogState, setReviewDialogState] = React.useState({
    open: false,
    favour: null,
  });

  const [favourMap, setFavourMap] = React.useState(
    new Map<string, (Requester & { owner: User })[]>(),
  );

  const favourServicer = new FavourService();
  React.useEffect(() => {
    if (!userContext.user?.uid) {
      return;
    }

    if (tabValue <= 2) {
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
      return;
    }

    // TODO: Dirty hack, assuming that "Working on Favours" and "Worked on Favours" are in position 4 and 5, so that the
    // favourState becomes ACCEPTED and DONE.
    favourServicer
      .getWorkedOnFavours(userContext.user.uid, tabValue - 2)
      .then((favourListI) => {
        const favourList = favourListI as (Favour & { acceptUser: User })[];
        favourList.forEach((favour) => (favour.acceptUser = userContext.user));
        setFavourList(favourList);
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

  const favourCardReview = (favour: Favour) => {
    setReviewDialogState({
      open: true,
      favour,
    });
  };

  const acceptPickerClose = () => {
    setAcceptPickerState({
      open: false,
      requestedUsers: [],
      selectedFavour: null,
    });
  };

  const reviewDialogClose = () => {
    setReviewDialogState({
      open: false,
      favour: null,
    });
  };

  const acceptPickerClick = (user: User) => {
    console.log(userContext.user.favourPoint);
    console.log(acceptPickerState.selectedFavour.cost);
    if (userContext.user.favourPoint < acceptPickerState.selectedFavour.cost) {
    } else {
      favourServicer.acceptFavour(
        acceptPickerState.selectedFavour,
        user,
        userContext.user,
      );
    }

    setAcceptPickerState({
      open: false,
      requestedUsers: [],
      selectedFavour: null,
    });

    // Just need something that changes
    setCompletedFavour(user.uid);
  };

  const reviewDialogComplete = (review: string, stars: number) => {
    favourServicer.setReview(reviewDialogState.favour, review, stars);
    setReviewDialogState({
      open: false,
      favour: null,
    });

    //TODO: Add a nice toast/snackbar notification that we have received the review?

    // Just need something that changes
    setCompletedFavour(review);
  };

  return (
    <div className={styles.content}>
      <AcceptPicker
        users={acceptPickerState.requestedUsers}
        open={acceptPickerState.open}
        handleClose={acceptPickerClose}
        onUserClick={acceptPickerClick}
      />
      <ReviewDialog
        open={reviewDialogState.open}
        onClose={reviewDialogClose}
        onComplete={reviewDialogComplete}
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
          <Tab label="Working on favours" />
          <Tab label="Worked on favours" />
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
                    onReview={favourCardReview}
                    requests={favourMap.get(favour.id)?.length || 0}
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
