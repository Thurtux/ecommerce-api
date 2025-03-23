import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtém a wishlist do usuário autenticado (incluindo os itens)
export const getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Supondo que o middleware de autenticação já insira o usuário em req.user
      const userId = (req as any).user.id;
  
      // Busca a wishlist do usuário; se não existir, cria uma nova
      let wishlist = await prisma.wishlist.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }, // Inclui dados do produto em cada item
      });
  
      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId },
          include: { items: { include: { product: true } } },
        });
      }
  
      res.status(200).json(wishlist);
    } catch (error) {
      next(error);
    }
  };

// Adiciona um produto à wishlist do usuário
export const addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ error: "O campo 'productId' é obrigatório." });
      return;
    }

    // Verifica se o produto existe
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    // Obtém ou cria a wishlist do usuário
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    // Tenta adicionar o produto; se já existir, retorna mensagem apropriada
    try {
      const wishlistItem = await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      res.status(201).json({ message: "Produto adicionado à wishlist.", wishlistItem });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Código de erro de duplicação do Prisma
        res.status(400).json({ error: "Produto já está na wishlist." });
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// Remove um produto da wishlist do usuário
export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;

    // Busca a wishlist do usuário
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      res.status(404).json({ error: "Wishlist não encontrada." });
      return;
    }

    // Deleta o item da wishlist
    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    res.status(200).json({ message: "Produto removido da wishlist." });
  } catch (error) {
    next(error);
  }
};
