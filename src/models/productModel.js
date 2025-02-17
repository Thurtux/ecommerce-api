const { db } = require("../config/firebaseConfig");

if (!db) {
  throw new Error("🔥 Firebase Firestore não foi inicializado corretamente!");
}

const collection = db.collection("products");

const ProductModel = {
  async create(data) {
    const productRef = await collection.add(data);
    return { id: productRef.id, ...data };
  },

  async getAll() {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const doc = await collection.doc(id).get();
    if (!doc.exists) throw new Error("Produto não encontrado.");
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    await collection.doc(id).update(data);
    return { id, ...data };
  },

  async delete(id) {
    await collection.doc(id).delete();
    return { message: "Produto removido com sucesso!" };
  },
};

module.exports = ProductModel;
