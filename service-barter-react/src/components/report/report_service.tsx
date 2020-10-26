import firebase from "firebase";

export type Report = {
  name: string;
  email: string;
  category: string;
  description: string;
  timestamp: firebase.firestore.Timestamp;
};

export type NewReport = {
  name: string;
  email: string;
  category: string;
  description: string;
};

export class ReportService {
  private reportsDb?: firebase.firestore.CollectionReference;
  constructor() {
    this.reportsDb = firebase.firestore().collection("reports");
  }

  public createReport(newReport: NewReport, ownerUid: string): Report {
    const report = {
      name: newReport.name,
      email: newReport.email,
      category: newReport.category,
      description: newReport.description,
      ownerUid: ownerUid,
      timestamp: firebase.firestore.Timestamp.now(),
    } as Report;

    this.reportsDb.doc().set(report);

    return report;
  }
}
