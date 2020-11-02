import { Snackbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import RoomIcon from "@material-ui/icons/Room";
import MuiAlert from "@material-ui/lab/Alert";
import Rating from "@material-ui/lab/Rating";
import * as firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";
import RSC from "react-scrollbars-custom";

import { Favour, FavourService } from "../../components/favour/favour_service";
import { UserContext } from "../../components/user/user_provider";
import styles from "./profile.scss";

export const Profile = React.memo(() => {
  const favServi = new FavourService();
  const userContext = React.useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [favourHist, setFavourHist] = React.useState({
    favHist: undefined,
  });

  React.useEffect(() => {
    if (userContext.loggedIn && !favourHist.favHist) {
      favServi.getFavours().then((favourList) => {
        const favHisto = favourList.filter(
          (favour) => favour.acceptUid == userContext.user.uid,
        );
        setFavourHist({ favHist: favHisto });
      });
    }
    console.log(favourHist.favHist);
    if (favourHist.favHist == undefined) {
      console.log("none whatsoever");
    }
  }, [userContext]);

  const resetPassword = () =>
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        setSnackbarOpen(true);
      });

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <div className={styles.content}>
      {userContext.user && (
        <RSC noScrollX>
          <div>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={2000}
              onClose={handleSnackbarClose}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity="success"
              >
                A password reset email has been sent to your email,{" "}
                {userContext.user.email}
              </MuiAlert>
            </Snackbar>
            <div className={styles.profile}>
              <Typography
                variant="h5"
                style={{ display: "inline-block", marginLeft: "30px" }}
              >
                {userContext.user.displayName}
              </Typography>
              <Typography
                variant="subtitle2"
                style={{ display: "inline-block", marginLeft: "20px" }}
              >
                {userContext.user.address}
              </Typography>
              <RoomIcon />
              <div className={styles.settingButtons}>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/editProfile"
                  style={{ marginRight: "10px" }}
                >
                  Edit profile
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetPassword}
                >
                  Reset Password
                </Button>
              </div>
              <div className={styles.profileBody}>
                <div>
                  <Typography
                    variant="h6"
                    style={{ display: "inline-block", position: "absolute" }}
                  >
                    Email address
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    style={{
                      display: "inline-block",
                      marginLeft: "17%",
                    }}
                  >
                    {userContext.user.email}
                  </Typography>
                  <div>
                    <Typography
                      style={{ display: "inline-block", position: "absolute" }}
                      variant="h6"
                    >
                      Favour points
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      style={{
                        display: "inline-block",
                        marginLeft: "17%",
                      }}
                    >
                      {userContext.user.favourPoint}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      style={{
                        display: "inline-block",
                        float: "left",
                        position: "absolute",
                      }}
                    >
                      Skills
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      style={{
                        display: "inline-block",
                        marginLeft: "17%",
                      }}
                    >
                      {userContext.user.skillList.length > 0 ? (
                        userContext.user.skillList.join(", ")
                      ) : (
                        <div>None</div>
                      )}
                    </Typography>
                  </div>
                </div>
                <Paper elevation={6} style={{ marginTop: "50px" }}>
                  <div className={styles.infoBox}>
                    <Typography variant="h5">Favour History</Typography>
                    <RSC noScrollX>
                      {favourHist?.favHist?.map((favour) => (
                        <Grid
                          container
                          key={favour.id}
                          direction={"column"}
                          spacing={2}
                        >
                          <Card>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                component="h2"
                              >
                                {favour.owner.displayName}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                component="h2"
                              >
                                {favour.title}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                component="h2"
                              >
                                {favour.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </RSC>
                  </div>
                </Paper>
                <Paper elevation={6} style={{ marginTop: "50px" }}>
                  <div className={styles.infoBox}>
                    <Typography variant="h5">Reviews</Typography>
                    <RSC noScrollX>
                      {favourHist?.favHist?.map((favour) => (
                        <Grid
                          container
                          key={favour.id}
                          direction={"column"}
                          spacing={2}
                        >
                          <Card>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                component="h2"
                              >
                                {favour.owner.displayName}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                component="h2"
                              >
                                {favour.review}
                              </Typography>
                              <Rating value={favour.stars} readOnly />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </RSC>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </RSC>
      )}
    </div>
  );
});
