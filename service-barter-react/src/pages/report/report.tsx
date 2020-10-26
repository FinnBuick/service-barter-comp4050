import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
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
    category: "Fake user",
    description: "",
  });
  const [categoryOthers, setCategoryOthers] = React.useState(false);
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
  };

  return (
    <div className={styles.content}>
      {userContext.user && (
        <div className={styles.report}>
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
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className={styles.categoryField}>
              <Typography className={styles.text} variant="h6">
                Category
              </Typography>
              <FormControl>
                <NativeSelect onChange={onCategoryChange}>
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
              onChange={onChange}
              style={{ marginTop: "10px", marginLeft: "30px", width: "800px" }}
            />
          </div>
          <div style={{ marginTop: "9px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={
                !(
                  /\S/.test(reportData.name) &&
                  /\S/.test(reportData.email) &&
                  /\S/.test(reportData.category) &&
                  /\S/.test(reportData.description)
                )
              }
              onClick={onSubmit}
              component={Link}
              to="/home"
            >
              Report
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "4%" }}
              component={Link}
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
