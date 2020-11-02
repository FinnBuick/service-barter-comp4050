// export function resetUI() {
//     clearMessages();
//     showToken('loading...');
//     // [START get_token]
//     // Get Instance ID token. Initially this makes a network call, once retrieved
//     // subsequent calls to getToken will return from cache.
//     messaging.getToken().then((currentToken) => {
//         if (currentToken) {
//             sendTokenToServer(currentToken);
//             updateUIForPushEnabled(currentToken);
//         } else {
//             // Show permission request.
//             console.log('No Instance ID token available. Request permission to generate one.');
//             // Show permission UI.
//             updateUIForPushPermissionRequired();
//             setTokenSentToServer(false);
//         }
//     }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//         showToken('Error retrieving Instance ID token. ', err);
//         setTokenSentToServer(false);
//     });
//     // [END get_token]
// }

// export function showToken(currentToken) {
//     // Show token in console and UI.
//     const tokenElement = document.querySelector('#token');
//     tokenElement.textContent = currentToken;
// }

// // Send the Instance ID token your application server, so that it can:
// // - send messages back to this app
// // - subscribe/unsubscribe the token from topics
// export function sendTokenToServer(currentToken) {
//     if (!isTokenSentToServer()) {
//         console.log('Sending token to server...');
//         // TODO(developer): Send the current token to your server.
//         setTokenSentToServer(true);
//     } else {
//         console.log('Token already sent to server so won\'t send it again ' +
//             'unless it changes');
//     }

// }

// export function isTokenSentToServer() {
//     return window.localStorage.getItem('sentToServer') === '1';
// }

// export function setTokenSentToServer(sent) {
//     window.localStorage.setItem('sentToServer', sent ? '1' : '0');
// }

// export function showHideDiv(divId, show) {
//     const div = document.querySelector('#' + divId);
//     if (show) {
//         div.style = 'display: visible';
//     } else {
//         div.style = 'display: none';
//     }
// }

// export function requestPermission() {
//     console.log('Requesting permission...');
//     // [START request_permission]
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//             // TODO(developer): Retrieve an Instance ID token for use with FCM.
//             // [START_EXCLUDE]
//             // In many cases once an app has been granted notification permission,
//             // it should update its UI reflecting this.
//             resetUI();
//             // [END_EXCLUDE]
//         } else {
//             console.log('Unable to get permission to notify.');
//         }
//     });
//     // [END request_permission]
// }

// export function deleteToken() {
//     // Delete Instance ID token.
//     // [START delete_token]
//     messaging.getToken().then((currentToken) => {
//         messaging.deleteToken(currentToken).then(() => {
//             console.log('Token deleted.');
//             setTokenSentToServer(false);
//             // [START_EXCLUDE]
//             // Once token is deleted update UI.
//             resetUI();
//             // [END_EXCLUDE]
//         }).catch((err) => {
//             console.log('Unable to delete token. ', err);
//         });
//         // [END delete_token]
//     }).catch((err) => {
//         console.log('Error retrieving Instance ID token. ', err);
//         showToken('Error retrieving Instance ID token. ', err);
//     });

// }

// // Add a message to the messages element.
// export function appendMessage(payload) {
//     const messagesElement = document.querySelector('#messages');
//     const dataHeaderELement = document.createElement('h5');
//     const dataElement = document.createElement('pre');
//     dataElement.style = 'overflow-x:hidden;';
//     dataHeaderELement.textContent = 'Received message:';
//     dataElement.textContent = JSON.stringify(payload, null, 2);
//     messagesElement.appendChild(dataHeaderELement);
//     messagesElement.appendChild(dataElement);
// }

// // Clear the messages element of all children.
// export function clearMessages() {
//     const messagesElement = document.querySelector('#messages');
//     while (messagesElement.hasChildNodes()) {
//         messagesElement.removeChild(messagesElement.lastChild);
//     }
// }

// export function updateUIForPushEnabled(currentToken) {
//     showHideDiv(tokenDivId, true);
//     showHideDiv(permissionDivId, false);
//     showToken(currentToken);
// }

// export function updateUIForPushPermissionRequired() {
//     showHideDiv(tokenDivId, false);
//     showHideDiv(permissionDivId, true);
// }

// resetUI();
