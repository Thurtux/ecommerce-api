import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtém o carrinho do usuário logado
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart) {
      res.status(404).json({ error: "Carrinho não encontrado." });
      return;
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// Adiciona um item ao carrinho
export const addItemToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({ error: "Os campos 'productId' e 'quantity' são obrigatórios." });
      return;
    }

    // Verifica se o usuário já possui um carrinho
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Verifica se o produto já está no carrinho e, se sim, atualiza a quantidade
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      res.status(200).json(updatedItem);
    } else {
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    next(error);
  }
};

// Atualiza a quantidade de um item no carrinho
export const updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // id do CartItem
    const { quantity } = req.body;
    if (quantity < 1) {
      res.status(400).json({ error: "A quantidade deve ser, no mínimo, 1." });
      return;
    }
    const updatedItem = await prisma.cartItem.update({
      where: { id: Number(id) },
      data: { quantity },
    });
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// Remove um item do carrinho
export const removeCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // id do CartItem
    await prisma.cartItem.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Limpa (remove todos os itens) o carrinho
export const clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ error: "Carrinho não encontrado." });
      return;
    }
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
