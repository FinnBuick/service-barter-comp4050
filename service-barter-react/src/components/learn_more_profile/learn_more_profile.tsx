import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import * as React from "react";

import { User } from "../../components/user/user_provider";

export const LearnMoreProfile = React.memo(
  ({
    open,
    owner,
    onClose,
  }: {
    open: boolean;
    owner: User;
    onClose: () => void;
  }) => {
    return (
      <>
        {owner ? (
          <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
            <DialogTitle style={{ marginTop: "5px" }}>
              <Avatar
                src={owner.photoURL || "invalid"}
                alt={owner.displayName}
                style={{
                  marginBottom: "5px",
                  float: "left",
                }}
              />
              <div style={{ marginLeft: "15%" }}>
                <CancelIcon style={{ float: "right" }} />
                {owner.displayName}
              </div>
            </DialogTitle>
            <DialogContent>
              <div>
                <div style={{ display: "inline-block" }}>
                  <Typography variant="body1">Email address</Typography>
                  <Typography variant="body1">Address</Typography>
                  <Typography variant="body1">Skills</Typography>
                </div>
                <div style={{ display: "inline-block", marginLeft: "5%" }}>
                  <Typography variant="body1" color="primary">
                    {owner.email}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {owner.address}
                  </Typography>
                  {owner.skillList.length > 0 ? (
                    <Typography variant="body1" color="primary">
                      {owner.skillList.join(", ")}
                    </Typography>
                  ) : (
                    <Typography variant="body1" color="primary">
                      None
                    </Typography>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
              <Typography>User not found!</Typography>
              <CancelIcon style={{ float: "right" }} onClick={onClose} />
            </DialogTitle>
          </Dialog>
        )}
      </>
    );
  },
);
