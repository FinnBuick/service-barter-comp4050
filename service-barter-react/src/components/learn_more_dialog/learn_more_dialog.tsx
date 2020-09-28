import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import * as React from "react";

import { User } from "../../components/user/user_provider";
import { formatDate } from "../../pages/marketplace/marketplace";
import { Favour } from "../favour/favour_service";

export const LearnMoreDialog = React.memo(
  ({
    open,
    favour,
    owner,
    onClose,
    showRequest,
    onRequest,
  }: {
    open: boolean;
    favour?: Favour;
    owner: User;
    onClose: () => void;
    showRequest: boolean;
    onRequest: () => void;
  }) => {
    return (
      <>
        {favour ? (
          <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
              <Avatar
                src={owner.photoURL || "invalid"}
                alt={owner.displayName}
                style={{
                  marginTop: "1.5%",
                  float: "left",
                  display: "inline-block",
                }}
              />
              <div style={{ marginLeft: "10%" }}>
                {favour.title}
                <CancelIcon style={{ float: "right" }} onClick={onClose} />
                <DialogContentText>by {owner.displayName}</DialogContentText>
              </div>
              <DialogContentText>
                {formatDate(favour.timestamp.toDate())}
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
                    {favour.actualLocation}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {favour.cost} Favour points
                  </Typography>
                </div>
              </div>
              <Typography variant="body1" style={{ marginTop: "3%" }}>
                Description
              </Typography>
              <Typography variant="subtitle1">{favour.description}</Typography>
              {showRequest && (
                <div
                  style={{
                    marginTop: "3%",
                    marginBottom: "1%",
                    textAlign: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={onRequest}
                  >
                    Send a request message
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
              <Typography>Data not found.</Typography>
              <CancelIcon style={{ float: "right" }} onClick={onClose} />
            </DialogTitle>
          </Dialog>
        )}
      </>
    );
  },
);
