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
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import RSC from "react-scrollbars-custom";

import { CreateFavourDialog } from "../../components/create_favour_dialog/create_favour_dialog";
import { CreateGroupDialog } from "../../components/create_group_dialog/create_group_dialog";
import {
  Favour,
  FavourService,
  NewFavour,
} from "../../components/favour/favour_service";
import {
  Group,
  GroupService,
  NewGroup,
} from "../../components/group/group_service";
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
    openGroupDialog: boolean;
    newFavour: NewFavour;
    selectedFavour: Favour;
    selectedFavourUser: User;
    favourList: (Favour & { owner: User })[];
    groupList: (Group & { member: User })[];
    newGroup: NewGroup;
  }
> {
  static contextType = UserContext;

  private favourServicer = new FavourService();
  private groupServicer = new GroupService();
  private userContext: UserContextProps;
  constructor(props, context) {
    super(props, context);
    this.state = {
      favourList: [],
      groupList: [],
      newFavour: {
        title: "",
        cost: 0,
        street: "",
        suburb: "",
        description: "",
        group: "",
      },
      newGroup: { title: "" },
      selectedFavour: undefined,
      selectedFavourUser: undefined,
      openFavourDialog: false,
      openGroupDialog: false,
      openLearnDialog: false,
    };
    this.userContext = context;
  }

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
            subheader={formatDate(favour.timestamp.toDate())}
          />
          <CardContent>
            <Typography
              variant="body2"
              className={styles.pos}
              color="textSecondary"
            >
              Location: {favour.roughLocation}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() =>
                this.setState({
                  selectedFavour: favour,
                  selectedFavourUser: user,
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
    this.favourServicer.getFavours().then((favourList) => {
      this.setState((state) => ({ ...state, favourList }));
    });
    this.groupServicer.getGroups().then((groupList) => {
      this.setState((state) => ({ ...state, groupList }));
    });
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      this.favourServicer.getFavours().then((favourList) => {
        this.setState((state) => ({ ...state, favourList }));
      });
      this.groupServicer.getGroups().then((groupList) => {
        this.setState((state) => ({ ...state, groupList }));
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
            owner={this.state.selectedFavourUser}
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
            <Button
              className={styles.buttons}
              variant="contained"
              color="primary"
              onClick={() => this.setState({ openGroupDialog: true })}
              startIcon={<AddIcon />}
            >
              Add New Group
            </Button>
            <CreateGroupDialog
              open={this.state.openGroupDialog}
              newGroup={this.state.newGroup}
              onClose={this.groupDialogClose}
              onCreate={this.onGroupCreated}
            />
          </div>
          <div>
            <Button className={styles.buttons} variant="contained">
              All Groups
            </Button>
            <Button className={styles.buttons} variant="contained">
              Group A
            </Button>
            {this.state.groupList.map((group) => (
              <Grid key={group.id} item xs={6} md={4} zeroMinWidth>
                <Button className={styles.buttons} variant="contained">
                  {group.title}
                </Button>
              </Grid>
            ))}
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

  private favourDialogClose = () => {
    this.setState({ openFavourDialog: false });
  };

  private groupDialogClose = () => {
    this.setState({ openGroupDialog: false });
  };
  private learnDialogClose = () => {
    this.setState({ openLearnDialog: false });
  };

  private learnDialogRequest = () => {
    this.favourServicer.requestFavour(
      this.state.selectedFavour.id,
      this.userContext.user.uid,
    );
    this.learnDialogClose();
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

  private onGroupCreated = () => {
    const createdGroup = this.groupServicer.createGroup(
      this.state.newGroup,
      this.userContext.user.uid,
    );

    // Add the newly created group to the list with the current user
    this.setState({
      groupList: [
        {
          ...createdGroup,
          member: this.userContext.user,
        },
        ...this.state.groupList,
      ],
    });

    this.groupDialogClose();
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
