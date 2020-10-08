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

import { NewFavour } from "../favour/favour_service";

export const CreateFavourDialog = React.memo(
  ({
    open,
    newFavour,
    onClose,
    onCreate,
  }: {
    open: boolean;
    newFavour: NewFavour;
    onClose: () => void;
    onCreate: () => void;
  }) => {
    const dataChanged = (e) => {
      newFavour[e.target.name] = e.target.value;
      setValid(
        newFavour.title !== "" &&
          newFavour.street !== "" &&
          newFavour.suburb !== "",
      );
    };

    const dataChangedNumber = (e) => {
      newFavour[e.target.name] = parseInt(e.target.value);
    };

    const [valid, setValid] = React.useState(false);

    return (
      <Dialog open={open} onClose={onClose} disableBackdropClick={true}>
        <DialogTitle>
          Add New Favour
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
          <TextField
            margin="dense"
            label="Street Address"
            name="street"
            onChange={dataChanged}
            required
            fullWidth
          />
          <TextField
            margin="dense"
            label="Suburb"
            name="suburb"
            onChange={dataChanged}
            required
            fullWidth
          />
          <TextField
            type="Number"
            margin="dense"
            label="Favour cost"
            defaultValue={0}
            name="cost"
            onChange={dataChangedNumber}
            required
            fullWidth
          />
          <TextField
            margin="dense"
            label="Skills required"
            name="skills"
            onChange={dataChanged}
            fullWidth
          />
          <TextField
            label="Favour Description"
            name="description"
            multiline
            rows={9}
            variant="outlined"
            onChange={dataChanged}
            style={{ marginTop: "19px" }}
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
