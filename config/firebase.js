
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        );

        console.log("Credenciais do Firebase carregadas pelo Render.");
    } catch (err) {
        throw new Error(
            "FIREBASE_SERVICE_ACCOUNT_KEY contém JSON inválido: " + err.message
        );
    }
} else {
    try {
        serviceAccount = require("./firebaseServiceAccountKey.json");
        console.log("Credenciais locais do Firebase carregadas.");
    } catch (err) {
        throw new Error(
            "Credenciais do Firebase não encontradas. Verifique a variável do Render ou o arquivo local."
        );
    }
}

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };
