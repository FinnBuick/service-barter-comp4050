/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
  cost: number;
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

  private FavourCard = React.memo(({ favour }: { favour: Favour }) => (
    <Paper>
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={styles.avatar}>
              A
            </Avatar>
          }
          title={favour.title}
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography
            variant="body2"
            className={styles.pos}
            color="textSecondary"
          >
            Location
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
              onClick={this.createFavour}
            >
              + Add New Favour
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
        <div className={styles.cardsWrapper}>
          <Typography>Cards</Typography>
          <RSC id="RSC-Example" style={{ width: "100%", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                {this.state.favourList == null ? (
                  <>
                    <CircularProgress />
                    <br />
                  </>
                ) : this.state.favourList.length === 0 ? (
                  <Typography>
                    There are no favours, start by creating one!
                  </Typography>
                ) : (
                  <>
                    {this.state.favourList.map((favour) => (
                      <this.FavourCard key={favour.id} favour={favour} />
                    ))}
                  </>
                )}
              </Grid>
            </Grid>
          </RSC>
        </div>
      </div>
    );
  }

  getFavours() {
    const user = this.userContext.user;
    this.favoursDb
      .doc(user.uid)
      .collection("favourList")
      .get()
      .then((value) => {
        this.setState((state) => ({
          ...state,
          favourList: value.docs.map((doc) => doc.data() as Favour),
        }));
      });
  }

  createFavour = () => {
    const favour = {
      title: "Test favour",
      cost: 100,
    } as Favour;

    const user = this.userContext.user;
    const doc = this.favoursDb.doc(user.uid);

    doc.collection("favourList").add(favour);

    this.setState((state) => ({
      ...state,
      favourList: [...this.state.favourList, favour],
    }));
  };
}
