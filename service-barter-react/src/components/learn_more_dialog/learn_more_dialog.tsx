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

import { LearnMoreProfile } from "../../components/learn_more_profile/learn_more_profile";
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
    const [openProfile, setOpenProfile] = React.useState(false);

    const closeProfile = () => {
      setOpenProfile(false);
    };

    return (
      <>
        {favour ? (
          <>
            <LearnMoreProfile
              open={openProfile}
              owner={owner}
              onClose={closeProfile}
            />
            <Dialog open={open} onClose={onClose} fullWidth>
              <DialogTitle>
                <Avatar
                  src={owner.photoURL || "invalid"}
                  alt={owner.displayName}
                  onClick={() => setOpenProfile(true)}
                  style={{
                    marginTop: "1.5%",
                    float: "left",
                  }}
                />
                <div style={{ marginLeft: "10%" }}>
                  {favour.title}
                  <CancelIcon style={{ float: "right" }} onClick={onClose} />
                  <DialogContentText onClick={() => setOpenProfile(true)}>
                    by {owner.displayName}
                  </DialogContentText>
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
                    <Typography variant="body1">Skills required</Typography>
                    <Typography variant="body1">Group</Typography>
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5%" }}>
                    <Typography variant="body1" color="primary">
                      {favour.actualLocation}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      {favour.cost} Favour points
                    </Typography>
                    {favour.skills.length > 0 ? (
                      <Typography variant="body1" color="primary">
                        {favour.skills.join(", ")}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="primary">
                        None
                      </Typography>
                    )}
                    <Typography variant="body1" color="primary">
                      {favour.groupTitle}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body1" style={{ marginTop: "3%" }}>
                  Description
                </Typography>
                <Typography variant="subtitle1">
                  {favour.description}
                </Typography>
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
                {!showRequest && (
                  <div
                    style={{
                      marginTop: "3%",
                      marginBottom: "1%",
                      textAlign: "center",
                    }}
                  >
                    <Button variant="outlined" disabled>
                      This is your favour request!
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
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
