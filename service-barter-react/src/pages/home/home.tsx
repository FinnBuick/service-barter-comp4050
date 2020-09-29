import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { Link } from "react-router-dom";

import { FavourCard } from "../../components/favour_card/favour_card";
import { Favour, FavourService } from "../../components/favour/favour_service";
import {
  User,
  UserContext,
  UserContextProps,
} from "../../components/user/user_provider";
import styles from "./home.scss";

export class Home extends React.Component<
  unknown,
  {
    recentFavourList: (Favour & { owner: User })[];
  }
> {
  static contextType = UserContext;
  private userContext: UserContextProps;
  private favourServicer = new FavourService();

  constructor(props, context) {
    super(props, context);
    this.state = {
      recentFavourList: [],
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
  }

  private favourCardClick = (favour: Favour, user: User) => {
    // this.setState({
    //   selectedFavour: favour,
    //   selectedFavourOwner: user,
    //   openLearnDialog: true,
    // });
  };

  render() {
    console.log(this.userContext);
    return (
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <Typography variant="h3">Service Barter</Typography>
          <Typography variant="body1">
            Short subtle description of the website
          </Typography>
          {!this.userContext.loggedIn && (
            <div className={styles.rootButton}>
              <Button
                component={Link}
                to="/signin"
                variant="contained"
                color="primary"
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
        <div className={styles.contentBody}>
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
                          viewFromHome={true}
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
              {this.state.recentFavourList.length === 0 ? (
                <Grid item xs={6} md={4}>
                  <Typography>There are no recent favour history!</Typography>
                </Grid>
              ) : (
                <>
                  {this.state.recentFavourList.slice(0, 3).map((favour) => (
                    <Grid className={styles.favourCard} key={favour.id}>
                      <FavourCard
                        favour={favour}
                        user={favour.owner}
                        viewFromHome={true}
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
