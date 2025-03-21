import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Criar variação de produto (Apenas Admin)
export const createVariation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, color, size, stock } = req.body;

    console.log("Recebendo requisição para criar variação:", req.body);

    // Verifica se o produto existe antes de criar a variação
    const productExists = await prisma.product.findUnique({ where: { id: productId } });
    if (!productExists) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    const variation = await prisma.productVariant.create({
      data: { productId, color, size, stock },
    });

    res.status(201).json({ message: "Variação criada com sucesso!", variation });
  } catch (error) {
    console.error("Erro ao criar variação:", error);
    res.status(400).json({ error: "Erro ao criar variação", details: error });
  }
};

// 📌 Listar variações de um produto (Todos)
export const getVariationsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Verifica se o produto existe antes de buscar variações
    const productExists = await prisma.product.findUnique({ where: { id: productId } });
    if (!productExists) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    const variations = await prisma.productVariant.findMany({
      where: { productId },
    });

    res.status(200).json(variations);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar variações" });
  }
};

// 📌 Atualizar variação (Apenas Admin)
export const updateVariation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { color, size, stock } = req.body;

    // Verifica se a variação existe antes de atualizar
    const existingVariation = await prisma.productVariant.findUnique({ where: { id } });
    if (!existingVariation) {
      res.status(404).json({ error: "Variação não encontrada." });
      return;
    }

    const updatedVariation = await prisma.productVariant.update({
      where: { id },
      data: { color, size, stock },
    });

    res.status(200).json({ message: "Variação atualizada!", updatedVariation });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar variação" });
  }
};

// 📌 Deletar variação (Apenas Admin)
export const deleteVariation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verifica se a variação existe antes de deletar
    const existingVariation = await prisma.productVariant.findUnique({ where: { id } });
    if (!existingVariation) {
      res.status(404).json({ error: "Variação não encontrada." });
      return;
    }

    await prisma.productVariant.delete({ where: { id } });

    res.status(200).json({ message: "Variação deletada com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar variação" });
  }
};
