const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const { getDatabase } = require("firebase-admin/database");

// Firebase Admin 초기화 (Netlify 환경변수에서 읽음)
function getApp() {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: "https://kangpilgaon-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { performedBy, performedByName, icon, title } = JSON.parse(event.body || "{}");
    const app = getApp();
    const db = getDatabase(app);

    // 상대방 역할
    const targetRole = performedBy === "me" ? "partner" : "me";

    // 상대방 FCM 토큰 가져오기
    const snap = await db.ref("app/deviceTokens/" + targetRole).once("value");
    const tokenData = snap.val();
    if (!tokenData?.token) return { statusCode: 200, body: JSON.stringify({ sent: false, reason: "no token" }) };

    const msg = {
      token: tokenData.token,
      notification: {
        title: (icon || "") + " " + (performedByName || "") + "이(가) 완료했어요!",
        body: title || "할 일 완료",
      },
      webpush: {
        notification: {
          icon: "https://kangpilgaon.netlify.app/icon.png",
          badge: "https://kangpilgaon.netlify.app/icon.png",
          vibrate: [200, 100, 200],
        },
        fcmOptions: { link: "https://kangpilgaon.netlify.app" },
      },
    };

    await getMessaging(app).send(msg);
    return { statusCode: 200, body: JSON.stringify({ sent: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 200, body: JSON.stringify({ sent: false, error: err.message }) };
  }
};
