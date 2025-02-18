const admin = require("firebase-admin");

// ⚠️ Verifica se a variável FIREBASE_CREDENTIALS está definida
if (!process.env.FIREBASE_CREDENTIALS) {
  throw new Error("🔥 ERRO: Variável FIREBASE_CREDENTIALS não configurada!");
}

// Converte a string JSON da variável de ambiente para um objeto
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://ecommerceapi-b5841-default-rtdb.firebaseio.com/", // Permite configurar via variável
});

// Inicializa o Firestore
const db = admin.firestore();

// Exporta admin e db
module.exports = { admin, db };
