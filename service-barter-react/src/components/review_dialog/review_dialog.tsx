import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import Rating from "@material-ui/lab/Rating";
import * as React from "react";

import { FavourService } from "../../components/favour/favour_service";
import { formatDate } from "../../pages/marketplace/marketplace";
import { Favour } from "../favour/favour_service";
import { User } from "../user/user_provider";

export const ReviewDialog = React.memo(
  ({
    open,
    favour,
    owner,
    acceptedUser,
    onClose,
    review,
  }: {
    open: boolean;
    favour?: Favour;
    owner: User;
    acceptedUser: User;
    onClose: () => void;
    review: string;
  }) => {
    const favServ = new FavourService();
    const [starValue, setStarValue] = React.useState(0);
    const onReviewFinish = () => {
      favServ.setReview(favour, review);
      onClose;
    };

    return (
      <>
        {favour ? (
          <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent>
              <Typography>Write a review!</Typography>
              <TextField
                required
                id="review-field"
                variant="outlined"
                label="Review"
                onChange={(e) => (review = e.target.value)}
              />
              <Rating
                name="star-rating"
                value={starValue}
                onChange={(event, newValue) => {
                  setStarValue(newValue);
                }}
              />
              <Button
                onClick={onReviewFinish}
                disabled={starValue == 0 || review == ""}
              >
                Submit
              </Button>
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
