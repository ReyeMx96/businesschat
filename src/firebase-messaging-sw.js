importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");
/* ===============================
   FORZAR ACTUALIZACIÓN DEL SW
================================ */

// ---- INICIALIZA TU PROYECTO ----
firebase.initializeApp({
      apiKey: "AIzaSyCMOPBhvt1I8BNOSXwCyQ3F0Dn8Z-o7qv0",
    authDomain: "the-business-chat.firebaseapp.com",
    projectId: "the-business-chat",
    storageBucket: "the-business-chat.appspot.com",
    messagingSenderId: "334464700800",
    appId: "1:334464700800:web:82d61bc9ecd265c1d87165",
});

// ---- NOTIFICACIÓN EN BACKGROUND ----
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("BG Message:", payload);

  const notificationTitle = "Nuevo mensaje de cliente";
  const notificationOptions = {
    body: "Nuevo mensaje recibido",
    icon: "payload.notification.icon"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
