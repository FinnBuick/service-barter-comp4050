import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import styles from "./marketplace.scss";

export class Marketplace extends React.Component {
  favours = [
    { title: "title", description: "" },
    { title: "title", description: "" },
    { title: "title", description: "" },
  ];
  FavourCard = (props) => {
    return (
      <Paper>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={styles.avatar}>
                A
              </Avatar>
            }
            title={props.title}
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
            <Typography variant="body2" component="p">
              {props.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Paper>
    );
  };
  MemoFavourCard = React.memo(this.FavourCard);

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.buttonsWrapper}>
          <div>
            <Button className={styles.buttons} variant="contained">
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
            {this.favours.map((favour) => (
              <Grid key={favour.title} item md={3}>
                <this.FavourCard title={favour.title} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}
