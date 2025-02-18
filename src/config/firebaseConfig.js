const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerceapi-b5841-default-rtdb.firebaseio.com/", // Verifique se está correto
});

const db = admin.firestore(); // Inicializa o Firestore

module.exports = { admin, db };
