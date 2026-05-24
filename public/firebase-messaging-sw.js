importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBGvYFT0H7C8yCg0ZdzOxoIyvClUGP9pbM",
  authDomain: "adepa-market.firebaseapp.com",
  projectId: "adepa-market",
  storageBucket: "adepa-market.firebasestorage.app",
  messagingSenderId: "421017223712",
  appId: "1:421017223712:web:7153e426cb0dc081bd7245",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title || "Adepa Market Notification";

  const options = {
    body:
      payload.notification?.body ||
      "You have a new update",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  };

  self.registration.showNotification(title, options);
});