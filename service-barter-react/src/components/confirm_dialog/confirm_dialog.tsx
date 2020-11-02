import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

import styles from "./confirm_dialog.scss";

export const ConfirmDialog = React.memo(
  ({
    title,
    open,
    handleClose,
    onConfirm,
  }: {
    title: string;
    open: boolean;
    handleClose: () => void;
    onConfirm: () => void;
  }) => (
    <Dialog
      classes={{ paper: styles.paper }}
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      {/* <DialogContent>{children}</DialogContent> */}
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="secondary">
          No
        </Button>
        <Button variant="contained" onClick={onConfirm} color="default">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  ),
);
