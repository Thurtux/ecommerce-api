import { createOrder } from "../models/orderModel.js";

export const checkout = async (req, res) => {
  try {
    const { userId, cartItems, totalPrice } = req.body;
    
    if (!userId || !cartItems || !totalPrice) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const newOrder = await createOrder(userId, cartItems, totalPrice);
    
    return res.status(201).json({ message: "Pedido criado!", order: newOrder });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar o pedido" });
  }
};
