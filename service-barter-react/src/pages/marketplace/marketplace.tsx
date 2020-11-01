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
import { CreateGroupDialog } from "../../components/create_group_dialog/create_group_dialog";
import { FavourCard } from "../../components/favour_card/favour_card";
import {
  Favour,
  FavourService,
  FavourState,
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
    openSuccessAlert: boolean;
    openFailAlert: boolean;
    newFavour: NewFavour;
    newGroup: NewGroup;
    selectedFavour: Favour;
    selectedFavourOwner: User;
    favourList: (Favour & { owner: User })[];
    groupList: (Group & { member: User })[];
    selectedGroup: string;
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
        skills: [],
        description: "",
        groupId: "",
        groupTitle: "",
      },
      newGroup: { title: "" },
      selectedFavour: undefined,
      selectedFavourOwner: undefined,
      openFavourDialog: false,
      openGroupDialog: false,
      openLearnDialog: false,
      openSuccessAlert: false,
      openFailAlert: false,
      selectedGroup: sessionStorage.getItem("selectedGroup"),
    };
    this.userContext = context;
  }

  private handleGroupSelect = (title) => {
    this.setState({ selectedGroup: title });
  };
  componentDidMount() {
    this.favourServicer.getFavours().then((favours) => {
      const favourList = favours.filter(
        (favour) => favour.state == FavourState.PENDING,
      );
      this.setState((state) => ({ ...state, favourList }));
    });
    this.groupServicer.getGroups().then((groupList) => {
      this.setState((state) => ({ ...state, groupList }));
    });
  }

  componentDidUpdate() {
    if (this.userContext != this.context) {
      this.userContext = this.context;
      this.favourServicer.getFavours().then((favours) => {
        const favourList = favours.filter(
          (favour) =>
            favour.state == FavourState.PENDING &&
            favour.groupTitle == this.state.selectedGroup,
        );
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
              userInfo={this.userContext.user}
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
              this.userContext.user.uid != "" &&
              this.userContext.user.uid != this.state.selectedFavourOwner?.uid
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
            {this.state.groupList.map((group) => (
              <Grid key={group.id} item xs={6} md={4} zeroMinWidth>
                <Button
                  className={styles.buttons}
                  variant="contained"
                  onClick={this.handleGroupSelect}
                >
                  {group.title}
                </Button>
              </Grid>
            ))}
          </div>
        </div>
        <div className={styles.cards}>
          <Collapse className={styles.alert} in={this.state.openSuccessAlert}>
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
          <Collapse className={styles.alert} in={this.state.openFailAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    this.setState({ openFailAlert: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Failed</AlertTitle>
              The request message has not been sent —{" "}
              <strong>Your skills does not meet the requirement</strong>
            </Alert>
          </Collapse>
          <Typography>Favours</Typography>
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

  private groupDialogClose = () => {
    this.setState({ openGroupDialog: false });
  };
  private learnDialogClose = () => {
    this.setState({ openLearnDialog: false });
  };

  private learnDialogRequest = () => {
    const requiredSkills = this.state.selectedFavour.skills;
    const userSkillList = this.userContext.user.skillList.map((s) =>
      s.toLowerCase(),
    );

    const metSkills = requiredSkills.filter((s) => {
      if (userSkillList.includes(s.toLowerCase())) return s;
    });

    if (
      this.userContext.user.uid != this.state.selectedFavourOwner.uid &&
      metSkills.length === requiredSkills.length
    ) {
      this.favourServicer.requestFavour(
        this.state.selectedFavour,
        this.userContext.user,
        this.state.selectedFavourOwner,
      );
      this.setState({ openSuccessAlert: true });
    } else {
      this.setState({ openFailAlert: true });
    }

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
