import { CardActionArea, CircularProgress } from "@material-ui/core";
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

import { UserContext } from "../../components/user/user_provider";
import styles from "./marketplace.scss";

type Favours = {
  id: string;
  title: string;
};
export class Marketplace extends React.Component<
  unknown,
  {
    id: undefined;
    favourList: Favours[];
  }
> {
  static contextType = UserContext;
  private database?: firebase.database.Database;
  private userContext: any;
  private favourListener?: any;

  constructor(props, context) {
    super(props, context);
    this.state = {
      id: undefined,
      favourList: undefined,
    };
    this.userContext = context;
  }

  private FavourCard = React.memo(({ favour }: { favour: Favours }) => {
    return (
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
    );
  });

  componentDidMount() {
    this.database = firebase.database();
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
        </div>
      </div>
    );
  }

  getFavours() {
    const user = this.userContext.user;
    this.database.ref(`/users/${user.uid}/favours`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        this.setState((state) => ({
          ...state,
          id: undefined,
          favourList: Object.values(snapshot.val()),
        }));
      } else {
        this.setState((state) => ({
          ...state,
          id: undefined,
          favourList: [],
        }));
      }
    });
  }

  createFavour = () => {
    const favourRef = this.database.ref().child("/favours").push();
    favourRef.set({
      id: favourRef.key,
      favourList: [],
    });

    const user = this.userContext.user;
    console.log(user);
    const favourName = `${"word"}${"word"}`;
    const favour = {
      id: favourRef.key,
      name: favourName,
    };

    this.database.ref(`/users/${user.uid}/favours`).push().set(favour);
  };
}
