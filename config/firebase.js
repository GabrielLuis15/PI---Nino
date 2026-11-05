const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n');
    serviceAccount = typeof rawKey === 'string' ? JSON.parse(rawKey) : rawKey;
  } catch (err) {
    console.error("Erro ao interpretar FIREBASE_SERVICE_ACCOUNT_KEY:", err);
  }
} else {
  try {
    serviceAccount = require("./firebaseServiceAccountKey.json");
  } catch (err) {
    console.error("Arquivo local firebaseServiceAccountKey.json não encontrado.");
  }
}

if (getApps().length === 0 && serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };