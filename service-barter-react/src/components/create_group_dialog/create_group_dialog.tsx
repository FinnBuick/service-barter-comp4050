import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import * as React from "react";

import { NewGroup } from "../group/group_service";
import styles from "./create_group_dialog.scss";

export const CreateGroupDialog = React.memo(
  ({
    open,
    newGroup,
    onClose,
    onCreate,
  }: {
    open: boolean;
    newGroup: NewGroup;
    onClose: () => void;
    onCreate: () => void;
  }) => {
    const dataChanged = (e) => {
      newGroup[e.target.name] = e.target.value;
      setValid(newGroup.title !== "");
    };

    const dataChangedNumber = (e) => {
      newGroup[e.target.name] = parseInt(e.target.value);
    };

    const [valid, setValid] = React.useState(false);

    return (
      <Dialog
        classes={{ paper: styles.paper }}
        open={open}
        onClose={onClose}
        disableBackdropClick={true}
      >
        <DialogTitle>
          Add New Group
          <CancelIcon style={{ float: "right" }} onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out all required fields.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            onChange={dataChanged}
            required
            fullWidth
          />
          <div style={{ marginTop: "9px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!valid}
              onClick={onCreate}
            >
              Upload
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "4%" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
