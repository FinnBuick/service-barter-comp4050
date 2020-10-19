import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//     functions.logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

export const createNotificationOnFavourRequest = functions.firestore.document('requests/{favourId}')
    .onUpdate((change, context) => {
        const newValue = change.after.data();

        functions.logger.log(newValue);
    });