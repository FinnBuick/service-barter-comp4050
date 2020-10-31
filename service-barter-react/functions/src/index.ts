import * as admin from "firebase-admin";
import { database, EventContext, firestore, logger } from "firebase-functions";
import { DataSnapshot } from "firebase-functions/lib/providers/database";

admin.initializeApp();

export const createNotificationOnFavourRequest = firestore
  .document("/requests/{favourId}/requests/{requestUserId}")
  .onCreate(
    (snapshot: firestore.QueryDocumentSnapshot, context: EventContext) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snapshot.data();

      // Access the parameter `{documentId}` with `context.params`
      logger.log("Notification", original, context.params);

      // get the favours ownerUid
      admin
        .firestore()
        .collection("favours")
        .doc(context.params.favourId)
        .get()
        .then((value) => {
          if (value.exists) {
            const favour = value.data();
            if (favour?.ownerUid) {
              const ownerUid = favour.ownerUid;
              if (ownerUid) {
                return admin
                  .firestore()
                  .collection("users")
                  .doc(ownerUid)
                  .get()
                  .then((data) => {
                    if (data.exists) {
                      const user = data.data();
                      if (user?.fcmTokens) {
                        var registrationTokens = user.fcmTokens;
                      }

                      // send notification via fcm
                      if (registrationTokens && user?.displayName) {
                        const message = {
                          tokens: registrationTokens,
                          notification: {
                            title: "New favour request!",
                            body: `${user.displayName} offered to do your favour!`,
                          },
                        };

                        return admin
                          .messaging()
                          .sendMulticast(message)
                          .then((response) => {
                            logger.log(
                              response.successCount +
                                " messages were sent successfully",
                            );
                          })
                          .catch((err) => logger.log(err));
                      }
                    }
                    return Promise.resolve();
                  })
                  .catch((err) => logger.log(err));
              }
            }
          }
          return Promise.resolve();
        })
        .catch((err) => logger.log(err));

      // get the owners fcm tokens

      return false;
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
        return roomRef.once("value", (room) => {
          if (!room.exists()) return;

          const newMessages = (room.val().newMessages || 0) + 1;
          return roomRef.update({ newMessages });
        });
      });
    }),
  );
