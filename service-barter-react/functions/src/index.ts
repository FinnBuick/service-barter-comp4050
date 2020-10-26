import * as admin from "firebase-admin";
import {
  database,
  EventContext,
  firestore,
  logger,
} from "firebase-functions";
import { DataSnapshot } from "firebase-functions/lib/providers/database";

admin.initializeApp();

export const createNotificationOnFavourRequest = firestore
  .document("/requests/{favourId}/requests/{requestUserId}")
  .onCreate(
    (snapshot: firestore.QueryDocumentSnapshot, context: EventContext) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snapshot.data().original;

      // Access the parameter `{documentId}` with `context.params`
      logger.log("Notification", context.params.documentId, original);
    },
  );

export const updateMessageCount = database
  .ref("/rooms/{roomId}/messages/{messageId}")
  .onCreate((snapshot: DataSnapshot, context: EventContext) =>
    snapshot.ref.parent?.parent?.child("users").once("value", (value) => {
      const users = value
        .val()
        .filter((user: string) => user !== snapshot.val().userId);
      logger.log(
        `Updating messaging for users, ${users} and room ${context.params.roomId}`,
      );
      users.forEach((user: string) => {
        const roomRef = admin
          .database()
          .ref(`users/${user}/rooms/${context.params.roomId}`);
        return roomRef.once("value", (room) =>
          roomRef.update({ newMessages: room.val().newMessages + 1 }),
        );
      });
    }),
  );
