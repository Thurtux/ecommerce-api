import { Request, Response, NextFunction } from "express";
import { PrismaClient, Review } from "@prisma/client";

const prisma = new PrismaClient();

// Cria uma nova avaliação para um produto
export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rating, comment, productId } = req.body;
    // Supondo que o middleware de autenticação coloque o usuário em req.user
    const userId = (req as any).user.id;

    if (rating === undefined || !productId) {
      res.status(400).json({ error: "Os campos 'rating' e 'productId' são obrigatórios." });
      return;
    }

    // Cria a avaliação
    const newReview: Review = await prisma.review.create({
      data: {
        rating,
        comment,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

// Atualiza uma avaliação feita pelo usuário
export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as any).user.id;

    // Verifica se a avaliação pertence ao usuário logado
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!review || review.userId !== userId) {
      res.status(403).json({ error: "Você não tem permissão para atualizar essa avaliação." });
      return;
    }

    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: { rating, comment },
    });

    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
};

// Exclui uma avaliação feita pelo usuário
export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Verifica se a avaliação pertence ao usuário logado
    const review = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!review || review.userId !== userId) {
      res.status(403).json({ error: "Você não tem permissão para excluir essa avaliação." });
      return;
    }

    await prisma.review.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Busca todas as avaliações de um produto (pode incluir paginacao se necessário)
export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    if (!productId) {
      res.status(400).json({ error: "O 'productId' é obrigatório." });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Calcula a média de avaliações de um produto (opcional)
export const getProductAverageRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    if (!productId) {
      res.status(400).json({ error: "O 'productId' é obrigatório." });
      return;
    }

    const result = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { productId },
    });

    res.json({ averageRating: result._avg.rating });
  } catch (error) {
    next(error);
  }
};
