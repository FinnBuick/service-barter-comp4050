import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { DataSnapshot } from "firebase-functions/lib/providers/database";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//     functions.logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

export const createNotificationOnFavourRequest = functions.firestore
  .document("requests/{favourId}/requests/{userId}")
  .onUpdate(
    (change: functions.Change<any>, context: functions.EventContext) => {
      const newValue = change.after.data();

      functions.logger.info("Favour request!", { structuredData: newValue });
      console.log(context.params.favourId);
    },
  );

export const updateMessageCount = functions.database
  .ref("/rooms/{roomId}/messages")
  .onCreate((snapshot: DataSnapshot, context: functions.EventContext) => {
    return snapshot.ref.parent
      ?.child("users")
      .once("value")
      .then((users) =>
        users.val().map((user: string) => {
          functions.logger.log(`Updating message count for ${user}`);

          const roomRef = admin
            .database()
            .ref(`users/${user}/rooms/${context.params.roomId}`);
          return roomRef.once("value").then((snap) => {
            const value = snap.val();
            functions.logger.log(`Value: ${value}`);
            return roomRef.set({
              ...value,
              newMessages: value.newMessages + 1,
            });
          });
        }),
      );
  });
