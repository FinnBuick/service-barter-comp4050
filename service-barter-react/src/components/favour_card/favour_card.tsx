import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import { formatDate } from "../../pages/marketplace/marketplace";
import { Favour } from "../favour/favour_service";
import { User } from "../user/user_provider";

export const FavourCard = React.memo(
  ({
    favour,
    user,
    onClick,
  }: {
    favour: Favour;
    user: User;
    onClick: (favour: Favour, user: User) => void;
  }) => {
    const onClickImpl = () => onClick(favour, user);

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
          <CardActions>
            <Button size="small" onClick={onClickImpl}>
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Paper>
    );
  },
);