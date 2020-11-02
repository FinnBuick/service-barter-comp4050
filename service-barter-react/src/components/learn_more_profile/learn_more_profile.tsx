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
          <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle style={{ marginTop: "5px" }}>
              <Avatar
                src={owner.photoURL || "invalid"}
                alt={owner.displayName}
                style={{
                  marginTop: "-5px",
                  marginBottom: "5px",
                  float: "left",
                }}
              />
              <div style={{ marginLeft: "10%" }}>
                <CancelIcon style={{ float: "right" }} />
                {owner.displayName}
              </div>
            </DialogTitle>
            <DialogContent>
              <div>
                <div style={{ marginTop: "5px" }}>
                  <Typography
                    variant="body1"
                    style={{ display: "inline-block", position: "absolute" }}
                  >
                    Email address
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    style={{ display: "inline-block", marginLeft: "21%" }}
                  >
                    {owner.email}
                  </Typography>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <Typography
                    variant="body1"
                    style={{ display: "inline-block", position: "absolute" }}
                  >
                    Address
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    style={{ display: "inline-block", marginLeft: "21%" }}
                  >
                    {owner.address}
                  </Typography>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <Typography
                    variant="body1"
                    style={{ display: "inline-block", position: "absolute" }}
                  >
                    Skills
                  </Typography>
                  {owner.skillList.length > 0 ? (
                    <Typography
                      variant="body1"
                      color="primary"
                      style={{
                        display: "inline-block",
                        marginLeft: "21%",
                        maxWidth: "330px",
                      }}
                    >
                      {owner.skillList.join(", ")}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      color="primary"
                      style={{ display: "inline-block", marginLeft: "21%" }}
                    >
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
