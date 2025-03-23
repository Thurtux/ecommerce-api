import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Converte o carrinho em um pedido (checkout)
export const checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Busca o carrinho do usuário com os itens e os produtos correspondentes
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: "Carrinho vazio." });
      return;
    }

    // Calcula o total e prepara os itens do pedido
    let total = 0;
    const orderItemsData = cart.items.map((item) => {
      const price = parseFloat(item.product.price.toString());
      total += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    // Cria o pedido e os itens relacionados
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Limpa o carrinho
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// Lista todos os pedidos do usuário logado
export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Obtém os detalhes de um pedido específico
export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });
    if (!order) {
      res.status(404).json({ error: "Pedido não encontrado." });
      return;
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
