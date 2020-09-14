import { CircularProgress } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import * as firebase from "firebase";
import * as React from "react";
import RSC from "react-scrollbars-custom";

import { Favour, FavourService } from "../../components/favour/favour_service";
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
    currentFavour: Favour;
    favourList: Favour[];
  }
> {
  static contextType = UserContext;

  private favourServicer = new FavourService();
  private userContext: UserContextProps;
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentFavour: undefined,
      openFavourDialog: false,
      openLearnDialog: false,
      favourList: [],
    };
    this.userContext = context;
  }

  private favourDialog = () => (
    <Dialog
      open={this.state.openFavourDialog}
      onClose={this.favourDialogClose}
      disableBackdropClick={true}
    >
      <DialogTitle>
        Add New Favour
        <CancelIcon
          style={{ float: "right" }}
          onClick={this.favourDialogClose}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out all required fields.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          onChange={(e) =>
            (this.favourServicer.newFavour = {
              ...this.favourServicer.newFavour,
              title: e.target.value,
            })
          }
          required
          fullWidth
        />
        <TextField
          margin="dense"
          label="Street Address"
          onChange={(e) =>
            (this.favourServicer.newFavour = {
              ...this.favourServicer.newFavour,
              street: e.target.value,
            })
          }
          required
          fullWidth
        />
        <TextField
          margin="dense"
          label="Suburb"
          onChange={(e) =>
            (this.favourServicer.newFavour = {
              ...this.favourServicer.newFavour,
              suburb: e.target.value,
            })
          }
          required
          fullWidth
        />
        <TextField
          type="Number"
          margin="dense"
          label="Favour cost"
          defaultValue="0"
          value={this.favourServicer.newFavour.cost}
          onChange={(e) =>
            (this.favourServicer.newFavour = {
              ...this.favourServicer.newFavour,
              cost: Number(e.target.value),
            })
          }
          required
          fullWidth
        />
        <TextField
          label="Favour Description"
          multiline
          rows={10}
          variant="outlined"
          onChange={(e) =>
            (this.favourServicer.newFavour = {
              ...this.favourServicer.newFavour,
              description: e.target.value,
            })
          }
          style={{ marginTop: "20px" }}
          fullWidth
        />
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={
              this.favourServicer.newFavour.title === "" ||
              this.favourServicer.newFavour.street === "" ||
              this.favourServicer.newFavour.suburb === ""
            }
            onClick={() => {
              this.favourServicer.createFavour();
              this.favourServicer.favourDialogClose();
            }}
          >
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

  private learnMoreDialog = () =>
    this.state.currentFavour ? (
      <Dialog
        open={this.state.openLearnDialog}
        onClose={this.learnDialogClose}
        fullWidth
      >
        <DialogTitle>
          {this.state.currentFavour.title}
          <CancelIcon
            style={{ float: "right" }}
            onClick={this.learnDialogClose}
          />
          <DialogContentText>
            {this.formatDate(this.state.currentFavour.timestamp.toDate())}
          </DialogContentText>
        </DialogTitle>
        <DialogContent>
          <div>
            <div style={{ display: "inline-block" }}>
              <Typography variant="body1">Location</Typography>
              <Typography variant="body1">Cost</Typography>
            </div>
            <div style={{ display: "inline-block", marginLeft: "5%" }}>
              <Typography variant="body1" color="primary">
                {this.state.currentFavour.actualLocation}
              </Typography>
              <Typography variant="body1" color="primary">
                {this.state.currentFavour.cost} Flavour points
              </Typography>
            </div>
          </div>
          <Typography variant="body1" style={{ marginTop: "3%" }}>
            Description
          </Typography>
          <Typography variant="subtitle1">
            {this.state.currentFavour.description}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginTop: "5%" }}
          >
            Accept
          </Button>
        </DialogContent>
      </Dialog>
    ) : (
      <Dialog
        open={this.state.openLearnDialog}
        onClose={this.learnDialogClose}
        fullWidth
      >
        <DialogTitle>
          <Typography>Data not found.</Typography>
          <CancelIcon
            style={{ float: "right" }}
            onClick={this.learnDialogClose}
          />
        </DialogTitle>
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
                  currentFavour: {
                    ...this.state.currentFavour,
                    title: favour.title,
                    description: favour.description,
                    cost: favour.cost,
                    timestamp: favour.timestamp,
                    actualLocation: favour.actualLocation,
                  },
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
}
