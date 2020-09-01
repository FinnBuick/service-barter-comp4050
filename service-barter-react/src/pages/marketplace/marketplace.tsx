import { CircularProgress } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { compareDesc, format, formatDistanceToNow } from "date-fns";
import * as firebase from "firebase";
import * as React from "react";
import RSC from "react-scrollbars-custom";

import {
  UserContext,
  UserContextProps,
} from "../../components/user/user_provider";
import styles from "./marketplace.scss";

type Favour = {
  id: string;
  title: string;
  owner: string;
  ownerName: string;
  ownerPhotoUrl: string;
  cost: number;

  timestamp: firebase.firestore.Timestamp;
  roughLocation: string;

  description: string;
  actualLocation: string;
};

export class Marketplace extends React.Component<
  unknown,
  {
    favourList: Favour[];
  }
> {
  static contextType = UserContext;
  private favoursDb?: firebase.firestore.CollectionReference;
  private userContext: UserContextProps;

  constructor(props, context) {
    super(props, context);
    this.state = {
      favourList: undefined,
    };
    this.userContext = context;
  }

  private formatDate = (date: Date) => (
    <>
      {format(date, "eeee, io LLLL")}
      <br />
      {formatDistanceToNow(date)} ago
    </>
  );

  private FavourCard = React.memo(({ favour }: { favour: Favour }) => (
    <Paper>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={favour.ownerPhotoUrl || "invalid"}
              alt={favour.ownerName}
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
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Paper>
  ));

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
              onClick={this.openFavourDialog}
              startIcon={<AddIcon />}
            >
              Add New Favour
            </Button>
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
                      <this.FavourCard favour={favour} />
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

  openFavourDialog = () => {
    this.createFavour(
      "Test favour",
      "40 Macquarie Drive Lane, North Ryde",
      100,
    );
  };

  getFavours() {
    const user = this.userContext.user;
    this.favoursDb
      .doc(user.uid)
      .collection("favourList")
      .get()
      .then((value) => {
        this.setState((state) => ({
          ...state,
          favourList: value.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Favour))
            .sort((f1, f2) =>
              compareDesc(f1.timestamp.toDate(), f2.timestamp.toDate()),
            ),
        }));
      });
  }

  createFavour = (title: string, location: string, cost: number) => {
    const user = this.userContext.user;
    const favour = {
      title,
      owner: user.uid,
      ownerName: user.displayName,
      ownerPhotoUrl: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      roughLocation: "Macquaire Park",
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
