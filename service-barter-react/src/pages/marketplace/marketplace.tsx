import { CircularProgress } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { compareDesc, format, formatDistanceToNow } from "date-fns";
import * as firebase from "firebase";
import * as React from "react";
import RSC from "react-scrollbars-custom";

import {
  User,
  UserContext,
  UserContextProps,
} from "../../components/user/user_provider";
import styles from "./marketplace.scss";

type Favour = {
  id: string;
  title: string;
  cost: number;
  ownerUid: string;

  timestamp: firebase.firestore.Timestamp;
  roughLocation: string;

  description: string;
  actualLocation: string;
};

export class Marketplace extends React.Component<
  unknown,
  {
    favourList: Favour[];
    userMapping: Map<string, User>;
    openFavourDialog: boolean;
    openLearnDialog: boolean;
    currentTitle: string;
    currentDescription: string;
  }
> {
  static contextType = UserContext;
  private favoursDb?: firebase.firestore.CollectionReference;
  private userContext: UserContextProps;
  constructor(props, context) {
    super(props, context);
    this.state = {
      favourList: [],
      userMapping: new Map(),
      openFavourDialog: false,
      openLearnDialog: false,
      currentTitle: null,
      currentDescription: null,
    };
    this.userContext = context;
  }

  private favourDialog = () => (
    // this.openFavourDialog
    <Dialog
      className={styles.dialogs}
      open={this.state.openFavourDialog}
      onClose={this.favourDialogClose}
      disableBackdropClick={true}
      aria-describedby="simple-modal-description"
    >
      <DialogTitle>
        Add New Favour
        <CancelIcon
          style={{ float: "right" }}
          onClick={this.favourDialogClose}
        />
      </DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Title" required fullWidth />
        <TextField
          autoFocus
          margin="dense"
          label="Location"
          required
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Favour points"
          required
          fullWidth
        />
        <TextField
          label="Favour Description"
          multiline
          rows={10}
          variant="outlined"
          style={{ marginTop: "20px" }}
          fullWidth
        />
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Button variant="contained" color="primary">
            Upload
          </Button>
          <Button
            variant="contained"
            style={{ marginLeft: "5%" }}
            onClick={this.favourDialogClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  favourDialogClose = () => {
    this.setState({ openFavourDialog: false });
  };

  openFavourDialog = () => {
    this.createFavour(
      "Test favour",
      "40 Macquarie Drive Lane, North Ryde",
      100,
    );
  };

  private learnMoreDialog = () => (
    <Dialog
      className={styles.dialogs}
      open={this.state.openLearnDialog}
      onClose={this.learnDialogClose}
      aria-describedby="simple-modal-description"
    >
      <DialogTitle>
        {this.state.currentTitle}
        <CancelIcon
          style={{ float: "right" }}
          onClick={this.learnDialogClose}
        />
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" id="simple-modal-description">
          {this.state.currentDescription}
        </Typography>
      </DialogContent>
    </Dialog>
  );

  learnDialogClose = () => {
    this.setState({ openLearnDialog: false });
  };

  private formatDate = (date: Date) => (
    <>
      {format(date, "eeee, io LLLL")}
      <br />
      {formatDistanceToNow(date)} ago
    </>
  );

  private FavourCard = React.memo(
    ({ favour, user }: { favour: Favour; user: User }) => (
      <Paper>
        <Card>
          <CardHeader
            avatar={
              <Avatar
                src={user?.photoURL || "invalid"}
                alt={user?.displayName}
              />
            }
            title={favour.title}
            subheader={this.formatDate(favour.timestamp.toDate())}
          />
          <CardContent>
            <Typography
              variant="body2"
              className={styles.pos}
              color="textSecondary"
            >
              Location: {favour.roughLocation}
            </Typography>
            <Typography variant="body2" component="p"></Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() =>
                this.setState({
                  currentTitle: favour.title,
                  currentDescription: favour.description,
                  openLearnDialog: true,
                })
              }
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Paper>
    ),
  );

  componentDidMount() {
    this.favoursDb = firebase.firestore().collection("favours");
    if (this.userContext.loggedIn) {
      this.getFavours();
    }
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      if (this.userContext.loggedIn) {
        this.getFavours();
      }
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
            <this.favourDialog />
          </div>
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
                      <this.FavourCard
                        favour={favour}
                        user={this.state.userMapping.get(favour.ownerUid)}
                      />
                      <this.learnMoreDialog />
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

  getFavours() {
    const user = firebase.auth().currentUser;
    this.favoursDb
      .doc(user.uid)
      .collection("favourList")
      .get()
      .then((value) => {
        const favourList = value.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Favour))
          .sort((f1, f2) =>
            compareDesc(f1.timestamp.toDate(), f2.timestamp.toDate()),
          );

        this.setState((state) => ({
          ...state,
          favourList,
        }));

        const getUsersPromises = favourList.map((favour) => {
          const ownerUid = favour.ownerUid;

          let promise: Promise<void | any> = Promise.resolve();
          if (!this.state.userMapping.has(ownerUid)) {
            promise = firebase
              .firestore()
              .collection("users")
              .doc(ownerUid)
              .get();
            promise.then((value) => {
              if (!value.exists) return;

              const user = value.data();
              this.state.userMapping.set(ownerUid, user);
            });
          }
          return promise;
        });
        Promise.all(getUsersPromises).then(() =>
          this.setState((state) => ({
            ...state,
            userMapping: new Map(this.state.userMapping),
          })),
        );
      });
  }

  createFavour = (title: string, location: string, cost: number) => {
    const user = firebase.auth().currentUser;
    const favour = {
      title,
      ownerUid: user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      roughLocation: "Macquaire Park",
      description: "Detailed description to be shown",
      actualLocation: location,
      cost,
    } as Favour;

    const doc = this.favoursDb.doc(user.uid);
    doc.collection("favourList").add(favour);

    favour.timestamp = firebase.firestore.Timestamp.now();
    this.setState((state) => ({
      ...state,
      favourList: [favour, ...this.state.favourList],
    }));
  };
}
