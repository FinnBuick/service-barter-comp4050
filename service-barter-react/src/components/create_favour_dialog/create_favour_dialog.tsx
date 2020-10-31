import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import * as React from "react";
import { WithContext as ReactTags } from "react-tag-input";

import { User } from "../../components/user/user_provider";
import { NewFavour } from "../favour/favour_service";
import styles from "./create_favour_dialog.scss";

export const CreateFavourDialog = React.memo(
  ({
    open,
    newFavour,
    userInfo,
    onClose,
    onCreate,
  }: {
    open: boolean;
    newFavour: NewFavour;
    userInfo: User;
    onClose: () => void;
    onCreate: () => void;
  }) => {
    const [newSkillList, setNewSkillList] = React.useState([]);
    const [allowPoint, setAllowPoint] = React.useState(true);

    const dataChanged = (e) => {
      newFavour[e.target.name] = e.target.value.trim();
      setValid(
        /\S/.test(newFavour.title) &&
          /\S/.test(newFavour.street) &&
          /\S/.test(newFavour.suburb) &&
          allowPoint,
      );
    };

    const dataChangedNumber = (e) => {
      newFavour[e.target.name] = parseInt(e.target.value);
      setValid(
        /\S/.test(newFavour.title) &&
          /\S/.test(newFavour.street) &&
          /\S/.test(newFavour.suburb) &&
          allowPoint,
      );
    };

    const [valid, setValid] = React.useState(false);

    /* Tag input logic */
    const handleTagAddition = (tag) => {
      setNewSkillList([...newFavour.skills, tag.text]);
      newFavour["skills"] = [...newFavour.skills, tag.text];
    };

    const handleTagDelete = (i) => {
      const newSkillList = newFavour.skills;
      newSkillList.splice(i, 1);
      setNewSkillList([...newSkillList]);
      newFavour["skills"] = newSkillList;
    };

    const handleClose = () => {
      newFavour["title"] = "";
      newFavour["street"] = "";
      newFavour["suburb"] = "";
      newFavour["skills"] = [];
      newFavour["description"] = "";
      setNewSkillList([...[]]);
      setValid(false);
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} disableBackdropClick={true}>
        <DialogTitle>
          Add New Favour
          <CancelIcon
            style={{ float: "right" }}
            onClick={() => handleClose()}
          />
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
            error={!allowPoint}
            helperText={allowPoint ? "" : "Out of balance"}
            onChange={(e) => {
              if (userInfo.favourPoint < Number(e.target.value)) {
                setAllowPoint(false);
              } else {
                setAllowPoint(true);
              }
              dataChangedNumber(e);
            }}
            required
            fullWidth
          />
          <Typography
            variant="subtitle1"
            style={{
              display: "inline-block",
              marginTop: "20px",
              marginRight: "10px",
            }}
          >
            Skills required:
          </Typography>
          <div style={{ display: "inline-block" }}>
            <ReactTags
              name="skills"
              classNames={{
                tags: styles.tags,
                tagInput: `${styles.tagInput} MuiInputBase-root MuiInput-underline`,
                tagInputField: `${styles.tagInputField} MuiInputBase-input`,
                selected: styles.selected,
                tag: `${styles.tag} MuiTypography-subtitle2`,
                remove: styles.remove,
                suggestions: styles.suggestions,
                activeSuggestion: styles.activeSuggestion,
              }}
              tags={newSkillList.map((skill, i) => {
                return {
                  id: `${i}`,
                  text: skill,
                };
              })}
              handleAddition={handleTagAddition}
              handleDelete={handleTagDelete}
            />
          </div>
          <TextField
            margin="dense"
            label="Group"
            name="groupTitle"
            onChange={dataChanged}
            required
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
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
