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
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import RSC from "react-scrollbars-custom";

import {
  Favour,
  FavourService,
  NewFavour,
} from "../../components/favour/favour_service";
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
    newFavour: NewFavour;
    selectedFavour: Favour;
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
      openFavourDialog: false,
      openLearnDialog: false,
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
            this.setState({
              newFavour: { ...this.state.newFavour, title: e.target.value },
            })
          }
          required
          fullWidth
        />
        <TextField
          margin="dense"
          label="Street Address"
          onChange={(e) =>
            this.setState({
              newFavour: { ...this.state.newFavour, street: e.target.value },
            })
          }
          required
          fullWidth
        />
        <TextField
          margin="dense"
          label="Suburb"
          onChange={(e) =>
            this.setState({
              newFavour: { ...this.state.newFavour, suburb: e.target.value },
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
          value={this.state.newFavour.cost}
          onChange={(e) =>
            this.setState({
              newFavour: {
                ...this.state.newFavour,
                cost: Number(e.target.value),
              },
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
            this.setState({
              newFavour: {
                ...this.state.newFavour,
                description: e.target.value,
              },
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
              this.state.newFavour.title === "" ||
              this.state.newFavour.street === "" ||
              this.state.newFavour.suburb === ""
            }
            onClick={() => {
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

  private favourDialogClose = () => {
    this.setState({ openFavourDialog: false });
  };

  private learnMoreDialog = () =>
    this.state.selectedFavour ? (
      <Dialog
        open={this.state.openLearnDialog}
        onClose={this.learnDialogClose}
        fullWidth
      >
        <DialogTitle>
          {this.state.selectedFavour.title}
          <CancelIcon
            style={{ float: "right" }}
            onClick={this.learnDialogClose}
          />
          <DialogContentText>
            {this.formatDate(this.state.selectedFavour.timestamp.toDate())}
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
                {this.state.selectedFavour.actualLocation}
              </Typography>
              <Typography variant="body1" color="primary">
                {this.state.selectedFavour.cost} Favour points
              </Typography>
            </div>
          </div>
          <Typography variant="body1" style={{ marginTop: "3%" }}>
            Description
          </Typography>
          <Typography variant="subtitle1">
            {this.state.selectedFavour.description}
          </Typography>
          <div
            style={{ marginTop: "3%", marginBottom: "1%", textAlign: "center" }}
          >
            <Button variant="outlined" color="primary">
              Accept
            </Button>
          </div>
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

  private learnDialogClose = () => {
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
                  selectedFavour: favour,
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
      this.favourServicer
        .getFavours(this.userContext.user.uid)
        .then((favourList) => {
          this.setState((state) => ({ ...state, favourList }));
        });
    }
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      if (this.userContext.loggedIn) {
        this.favourServicer
          .getFavours(this.userContext.user.uid)
          .then((favourList) => {
            this.setState((state) => ({ ...state, favourList }));
          });
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
                      <this.FavourCard favour={favour} user={favour.owner} />
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
