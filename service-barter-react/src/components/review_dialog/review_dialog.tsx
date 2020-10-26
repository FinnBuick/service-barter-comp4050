import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Rating from "@material-ui/lab/Rating";
import * as React from "react";

import styles from "./review_dialog.scss";

export const ReviewDialog = React.memo(
  ({
    open,
    onClose,
    onComplete,
  }: {
    open: boolean;
    onClose: () => void;
    onComplete: (review: string, starValue: number) => void;
  }) => {
    const [starValue, setStarValue] = React.useState(0);
    const [review, setReview] = React.useState("");

    const onReviewFinish = () => onComplete(review, starValue);

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogContent className={styles.reviewContent}>
          <Typography gutterBottom>Write a review!</Typography>
          <TextField
            id="review-field"
            className={styles.textArea}
            required
            multiline
            rows={4}
            variant="outlined"
            label="Review"
            onChange={(e) => setReview(e.target.value)}
          />
          <Rating
            name="star-rating"
            value={starValue}
            onChange={(event, newValue) => {
              setStarValue(newValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onReviewFinish}
            disabled={starValue === 0 || review === ""}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);
