import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import { Link } from "react-router-dom";

import { FavourCard } from "../../components/favour_card/favour_card";
import { Favour, FavourService } from "../../components/favour/favour_service";
import { LearnMoreDialog } from "../../components/learn_more_dialog/learn_more_dialog";
import {
  User,
  UserContext,
  UserContextProps,
} from "../../components/user/user_provider";
import styles from "./home.scss";

export class Home extends React.Component<
  unknown,
  {
    openSuccessAlert: boolean;
    openLearnDialog: boolean;
    openFailAlert: boolean;
    selectedFavour: Favour;
    selectedFavourOwner: User;
    recentFavourList: (Favour & { owner: User })[];
    favourHistory: Favour[];
  }
> {
  static contextType = UserContext;
  private userContext: UserContextProps;
  private favourServicer = new FavourService();

  constructor(props, context) {
    super(props, context);
    this.state = {
      openSuccessAlert: false,
      openFailAlert: false,
      openLearnDialog: false,
      selectedFavour: undefined,
      selectedFavourOwner: undefined,
      recentFavourList: [],
      favourHistory: undefined,
    };
    this.userContext = context;
  }

  componentDidMount() {
    this.favourServicer.getFavours().then((recentFavourList) => {
      this.setState((state) => ({ ...state, recentFavourList }));
    });
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      this.favourServicer.getFavours().then((recentFavourList) => {
        this.setState((state) => ({ ...state, recentFavourList }));
      });
    }

    if (this.userContext.loggedIn && !this.state.favourHistory) {
      this.favourServicer
        .getUserFavours(this.userContext.user.uid)
        .then((favourHistory) => {
          console.log(favourHistory);
          this.setState((state) => ({ ...state, favourHistory }));
        });
    }
  }

  private favourCardClick = (favour: Favour, user: User) => {
    this.setState({
      selectedFavour: favour,
      selectedFavourOwner: user,
      openLearnDialog: true,
    });
  };

  private learnDialogClose = () => {
    this.setState({ openLearnDialog: false });
  };

  private learnDialogRequest = () => {
    const requiredSkills = this.state.selectedFavour.skills;
    const userSkillList = this.userContext.user.skillList.map((s) =>
      s.toLowerCase(),
    );

    const metSkills = requiredSkills.filter((s) => {
      if (userSkillList.includes(s.toLowerCase())) return s;
    });

    if (
      this.userContext.user.uid != this.state.selectedFavourOwner.uid &&
      metSkills.length === requiredSkills.length
    ) {
      this.favourServicer.requestFavour(
        this.state.selectedFavour,
        this.userContext.user,
        this.state.selectedFavourOwner,
      );
      this.setState({ openSuccessAlert: true });
    } else {
      this.setState({ openFailAlert: true });
    }

    this.learnDialogClose();
  };

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <div>
            {this.userContext.loggedIn ? (
              <Typography variant="h3">
                Welcome, {this.userContext.user.displayName}!
              </Typography>
            ) : (
              <Typography variant="h3">Welcome to Help.Me!</Typography>
            )}
          </div>
          {!this.userContext.loggedIn && (
            <div className={styles.rootButton}>
              <Button
                component={Link}
                to="/signin"
                variant="contained"
                color="secondary"
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
        <Collapse className={styles.alert} in={this.state.openSuccessAlert}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.setState({ openSuccessAlert: false });
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Success</AlertTitle>
            The request message has been sent —{" "}
            <strong>check out the message!</strong>
          </Alert>
        </Collapse>
        <Collapse className={styles.alert} in={this.state.openFailAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.setState({ openFailAlert: false });
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Failed</AlertTitle>
            The request message could not been sent —{" "}
            <strong>Your skills does not meet the requirement</strong>
          </Alert>
        </Collapse>
        <div className={styles.contentBody}>
          <LearnMoreDialog
            open={this.state.openLearnDialog}
            favour={this.state.selectedFavour}
            owner={this.state.selectedFavourOwner}
            onClose={this.learnDialogClose}
            showRequest={
              this.userContext.user != undefined &&
              this.userContext.user.uid != "" &&
              this.userContext.user.uid != this.state.selectedFavourOwner?.uid
            }
            onRequest={this.learnDialogRequest}
          />
          <div className={styles.listFavours}>
            <Typography variant="h5">Recent favours</Typography>
            <Grid container className={styles.grid}>
              <Grid container justify="center">
                {this.state.recentFavourList.length === 0 ? (
                  <Grid item xs={6} md={4}>
                    <Typography>There are no recent favours!</Typography>
                  </Grid>
                ) : (
                  <>
                    {this.state.recentFavourList.slice(0, 3).map((favour) => (
                      <Grid className={styles.favourCard} key={favour.id}>
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
            </Grid>
          </div>
          <Typography variant="h5">Recent favour history</Typography>
          <Grid container className={styles.grid}>
            <Grid container justify="center">
              {!this.state.favourHistory ? (
                <Grid item xs={6} md={4}>
                  <Typography>
                    Please create an account to view your favour history!
                  </Typography>
                </Grid>
              ) : this.state.favourHistory.length === 0 ? (
                <Grid item xs={6} md={4}>
                  <Typography>
                    You do not have any favour history yet!
                  </Typography>
                </Grid>
              ) : (
                <>
                  {this.state.favourHistory.slice(0, 3).map((favour) => (
                    <Grid className={styles.favourCard} key={favour.id}>
                      <FavourCard
                        favour={favour}
                        user={this.userContext.user}
                        onClick={this.favourCardClick}
                      />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
