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
import { Favour, FavourService } from "../favour/favour_service";
import { User } from "../user/user_provider";

export const FavourCard = React.memo(
  ({
    favour,
    user,
    acceptUser,
    onClick,
    requests,
    viewRequests,
    completedFavour,
  }: {
    favour: Favour;
    user: User;
    acceptUser?: User;
    onClick: (favour: Favour, user: User) => void;
    requests?: number;
    viewRequests?: boolean;
    completedFavour?: number;
  }) => {
    const favServer = new FavourService();
    const onClickImpl = () => onClick(favour, user);
    const completeFavour = () => favServer.completeFavour(favour);

    return (
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
              <Button
                size="small"
                onClick={onClickImpl}
                disabled={requests === 0 || acceptUser != null}
              >
                {acceptUser && favour.state != 2 ? (
                  <>Accepted by {acceptUser.displayName}</>
                ) : acceptUser && favour.state == 2 ? (
                  <>Completed by {acceptUser.displayName}</>
                ) : (
                  <>
                    View requests &nbsp;
                    <Badge badgeContent={requests} color="primary" showZero>
                      <MailIcon />
                    </Badge>
                  </>
                )}
              </Button>
              <>
                {acceptUser && favour.state != 2 ? (
                  <Button
                    size="small"
                    onClick={completeFavour}
                    disabled={false}
                  >
                    Confirm completion
                  </Button>
                ) : (
                  <></>
                )}
              </>
            </CardActions>
          )}
        </Card>
      </Paper>
    );
  },
);
