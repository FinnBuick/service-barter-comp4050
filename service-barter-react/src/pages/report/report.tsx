import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import NativeSelect from "@material-ui/core/NativeSelect";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import { Link } from "react-router-dom";

import { ReportService } from "../../components/report/report_service";
import { UserContext } from "../../components/user/user_provider";
import styles from "./report.scss";

export const Report = React.memo(() => {
  const userContext = React.useContext(UserContext);
  const [reportData, setReportData] = React.useState({
    name: "",
    email: "",
    category: "Favour issue",
    description: "",
  });
  const [categoryOthers, setCategoryOthers] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const reportServicer = new ReportService();

  React.useEffect(() => {
    if (!userContext.user) {
      return;
    }
  }, [userContext]);

  const onChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const onCategoryChange = (e) => {
    const reportCategory = e.target.value;
    if (reportCategory === "Others") {
      setReportData({ ...reportData, category: "" });
      setCategoryOthers(true);
    } else {
      setReportData({ ...reportData, category: reportCategory });
      setCategoryOthers(false);
    }
  };

  const onSubmit = () => {
    reportServicer.createReport(reportData, userContext.user.uid);
    setReportData({
      name: "",
      email: "",
      category: "Favour issue",
      description: "",
    });
    setCategoryOthers(false);
    setSuccessOpen(true);
  };

  return (
    <div className={styles.content}>
      {userContext.user && (
        <div className={styles.report}>
          <Collapse className={styles.alert} in={successOpen}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setSuccessOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Success</AlertTitle>
              The report has been sent —{" "}
              <strong>
                Our team will send you an email as soon as possible!
              </strong>
            </Alert>
          </Collapse>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Report an issue
          </Typography>
          <div className={styles.reportInfo}>
            <Typography variant="subtitle1" color="secondary">
              Please fill out all fields*
            </Typography>
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Name
              </Typography>
              <TextField
                className={styles.textField}
                value={reportData.name}
                name="name"
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.text} variant="h6">
                Email address
              </Typography>
              <TextField
                className={styles.textField}
                name="email"
                value={reportData.email}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className={styles.categoryField}>
              <Typography className={styles.text} variant="h6">
                Category
              </Typography>
              <FormControl>
                <NativeSelect
                  value={categoryOthers ? "Others" : reportData.category}
                  onChange={onCategoryChange}
                >
                  <option>Favour issue</option>
                  <option>Fake user</option>
                  <option>Incorrect user information</option>
                  <option>Account stolen</option>
                  <option>Bug found</option>
                  <option>Others</option>
                </NativeSelect>
              </FormControl>
              {categoryOthers && (
                <TextField
                  className={styles.othersField}
                  placeholder="Please specify"
                  name="category"
                  onChange={(e) => onChange(e)}
                />
              )}
            </div>
          </div>
          <div className={styles.reportContent}>
            <Typography variant="h6" style={{ marginLeft: "30px" }}>
              Description
            </Typography>
            <TextField
              name="description"
              multiline
              rows={9}
              variant="outlined"
              value={reportData.description}
              onChange={onChange}
              style={{ marginTop: "10px", marginLeft: "30px", width: "800px" }}
            />
          </div>
          <div style={{ marginTop: "9px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={
                !(
                  /\S/.test(reportData.name) &&
                  /\S/.test(reportData.email) &&
                  /\S/.test(reportData.category) &&
                  /\S/.test(reportData.description)
                )
              }
              onClick={onSubmit}
            >
              Report
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "4%" }}
              component={Link}
              color="secondary"
              to="/home"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
