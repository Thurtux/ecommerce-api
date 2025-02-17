import { db } from "../config/firebaseConfig.js";
import { Timestamp } from "firebase/firestore";

const ordersCollection = db.collection("orders");

export const createOrder = async (userId, items, totalPrice) => {
  const newOrder = {
    userId,
    items,
    totalPrice,
    status: "pendente", // "pendente", "pago", "enviado"
    createdAt: Timestamp.now(),
  };

  const orderRef = await ordersCollection.add(newOrder);
  return { id: orderRef.id, ...newOrder };
};
