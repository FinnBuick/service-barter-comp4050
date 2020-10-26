// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCOMjZi_fUKGx03H4ScXGxoiA8ru9R61pU",
    authDomain: "service-barter-comp4050.firebaseapp.com",
    databaseURL: "https://service-barter-comp4050.firebaseio.com",
    projectId: "service-barter-comp4050",
    storageBucket: "service-barter-comp4050.appspot.com",
    messagingSenderId: "889395434104",
    appId: "1:889395434104:web:fc44924538905e413b538d",
    measurementId: "G-25WF1SXZ5K"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();