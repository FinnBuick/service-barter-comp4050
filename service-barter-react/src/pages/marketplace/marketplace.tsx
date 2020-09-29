import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import RSC from "react-scrollbars-custom";

import { CreateFavourDialog } from "../../components/create_favour_dialog/create_favour_dialog";
import { FavourCard } from "../../components/favour_card/favour_card";
import {
  Favour,
  FavourService,
  NewFavour,
} from "../../components/favour/favour_service";
import { LearnMoreDialog } from "../../components/learn_more_dialog/learn_more_dialog";
import {
  User,
  UserContext,
  UserContextProps,
} from "../../components/user/user_provider";
import styles from "./marketplace.scss";

export class Marketplace extends React.Component<
  unknown,
  {
    openFavourDialog: boolean;
    openLearnDialog: boolean;
    openSuccessAlert: boolean;
    newFavour: NewFavour;
    selectedFavour: Favour;
    selectedFavourOwner: User;
    favourList: (Favour & { owner: User })[];
  }
> {
  static contextType = UserContext;

  private favourServicer = new FavourService();
  private userContext: UserContextProps;
  constructor(props, context) {
    super(props, context);
    this.state = {
      favourList: [],
      newFavour: {
        title: "",
        cost: 0,
        street: "",
        suburb: "",
        description: "",
      },
      selectedFavour: undefined,
      selectedFavourOwner: undefined,
      openFavourDialog: false,
      openLearnDialog: false,
      openSuccessAlert: false,
    };
    this.userContext = context;
  }

  componentDidMount() {
    this.favourServicer.getFavours().then((favourList) => {
      this.setState((state) => ({ ...state, favourList }));
    });
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      this.favourServicer.getFavours().then((favourList) => {
        this.setState((state) => ({ ...state, favourList }));
      });
    }
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.buttonsWrapper}>
          <div>
            <Button
              className={styles.buttons}
              variant="contained"
              color="primary"
              onClick={() => this.setState({ openFavourDialog: true })}
              startIcon={<AddIcon />}
            >
              Add New Favour
            </Button>
            <CreateFavourDialog
              open={this.state.openFavourDialog}
              newFavour={this.state.newFavour}
              onClose={this.favourDialogClose}
              onCreate={this.onFavourCreated}
            />
          </div>
          <LearnMoreDialog
            open={this.state.openLearnDialog}
            favour={this.state.selectedFavour}
            owner={this.state.selectedFavourOwner}
            onClose={this.learnDialogClose}
            showRequest={
              this.userContext.user != undefined &&
              this.userContext.user.uid != ""
            }
            onRequest={this.learnDialogRequest}
          />
          <br />
          <Typography>Groups</Typography>
          <div>
            <Button className={styles.buttons} variant="contained">
              All Groups
            </Button>
            <Button className={styles.buttons} variant="contained">
              Group A
            </Button>
            <Button className={styles.buttons} variant="contained">
              Group B
            </Button>
            <Button className={styles.buttons} variant="contained">
              Group C
            </Button>
          </div>
        </div>
        <div className={styles.cards}>
          <Collapse in={this.state.openSuccessAlert}>
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
          <Typography>Cards</Typography>
          <RSC noScrollX>
            <Grid className={styles.cardsWrapper} container spacing={2}>
              {this.state.favourList == null ? (
                <Grid item xs={6} md={4} zeroMinWidth>
                  <CircularProgress />
                  <br />
                </Grid>
              ) : this.state.favourList.length === 0 ? (
                <Grid item xs={6} md={4} zeroMinWidth>
                  <Typography>
                    There are no favours, start by creating one!
                  </Typography>
                </Grid>
              ) : (
                <>
                  {this.state.favourList.map((favour) => (
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
      </div>
    );
  }

  private favourCardClick = (favour: Favour, user: User) => {
    this.setState({
      selectedFavour: favour,
      selectedFavourOwner: user,
      openLearnDialog: true,
    });
  };

  private favourDialogClose = () => {
    this.setState({ openFavourDialog: false });
  };

  private learnDialogClose = () => {
    this.setState({ openLearnDialog: false });
  };

  private learnDialogRequest = () => {
    this.favourServicer.requestFavour(
      this.state.selectedFavour.id,
      this.userContext.user,
      this.state.selectedFavourOwner,
    );
    this.learnDialogClose();
    this.setState({ openSuccessAlert: true });
  };

  private onFavourCreated = () => {
    const createdFavour = this.favourServicer.createFavour(
      this.state.newFavour,
      this.userContext.user.uid,
    );

    // Add the newly created favour to the list with the current user
    this.setState({
      favourList: [
        {
          ...createdFavour,
          owner: this.userContext.user,
        },
        ...this.state.favourList,
      ],
    });

    this.favourDialogClose();
  };
}

export function formatDate(date: Date): JSX.Element {
  return (
    <>
      {format(date, "eeee, io LLLL")}
      <br />
      {formatDistanceToNow(date)} ago
    </>
  );
}
