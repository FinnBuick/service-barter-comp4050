import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import * as React from "react";

import { formatDate } from "../../pages/marketplace/marketplace";
import { Favour, FavourState } from "../favour/favour_service";
import { User } from "../user/user_provider";
import styles from "./favour_card.scss";
export const FavourCard = React.memo(
  ({
    favour,
    user,
    acceptUser,
    onClick,
    onComplete,
    onReview,
    requests,
    viewRequests,
  }: {
    favour: Favour;
    user: User;
    acceptUser?: User;
    onClick: (favour: Favour, user: User) => void;
    onComplete?: (favour: Favour, user: User) => void;
    onReview?: (favour: Favour, user: User) => void;
    requests?: number;
    viewRequests?: boolean;
  }) => {
    const onClickImpl = () => onClick(favour, user);
    const completeFavour = () => onComplete(favour, user);
    const reviewFavour = () => onReview(favour, user);

    return (
      <Paper>
        <Card className={styles.favour_card}>
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
            <Typography variant="body2" color="textSecondary">
              Location: {favour.roughLocation}
            </Typography>
          </CardContent>
          {!viewRequests && (
            <CardActions>
              <Button size="small" onClick={onClickImpl}>
                Learn More
              </Button>
            </CardActions>
          )}
          {viewRequests && (
            <CardActions>
              {user.uid !== acceptUser?.uid && (
                <Button
                  size="small"
                  onClick={onClickImpl}
                  disabled={requests === 0 || acceptUser != null}
                >
                  {favour.state === FavourState.PENDING ? (
                    <>
                      View requests &nbsp;
                      <Badge badgeContent={requests} color="primary" showZero>
                        <MailIcon />
                      </Badge>
                    </>
                  ) : favour.state === FavourState.ACCEPTED ? (
                    <>Accepted by {acceptUser?.displayName}</>
                  ) : (
                    <>Completed by {acceptUser?.displayName}</>
                  )}
                </Button>
              )}
              {favour.state === FavourState.ACCEPTED &&
                user.uid !== acceptUser?.uid && (
                  <Button size="small" onClick={completeFavour}>
                    Confirm completion
                  </Button>
                )}
              {favour.state === FavourState.DONE &&
                favour.acceptUid !== user.uid && (
                  <Button
                    size="small"
                    onClick={reviewFavour}
                    disabled={!!favour.review}
                  >
                    {favour.review ? "Review received!" : "Complete a review?"}
                  </Button>
                )}
            </CardActions>
          )}
        </Card>
      </Paper>
    );
  },
);
