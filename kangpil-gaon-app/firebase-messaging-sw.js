importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBYq8_02GuOh99YtqaJh0JgJ-KoHxR_SHA",
  authDomain: "kangpilgaon.firebaseapp.com",
  databaseURL: "https://kangpilgaon-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kangpilgaon",
  storageBucket: "kangpilgaon.firebasestorage.app",
  messagingSenderId: "203772189818",
  appId: "1:203772189818:web:452257915a4105ec922fc3"
});

const messaging = firebase.messaging();

// 백그라운드 알림 처리
messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || "우리집 당번", {
    body: body || "",
    icon: icon || "/icon.png",
    badge: "/icon.png",
    vibrate: [200, 100, 200],
  });
});
