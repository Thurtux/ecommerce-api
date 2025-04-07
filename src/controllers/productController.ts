import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar produto (Apenas Admin)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, color, size, img } = req.body;

    const data: any = { name, description, price, stock, color, size };

    if (img) {
      data.img = img; // Só adiciona img se for fornecido
    }

    const product = await prisma.product.create({ data });

    res.status(201).json({ message: "Produto criado com sucesso!", product });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar produto" });
  }
};

// Atualizar produto (Apenas Admin)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, color, size, img } = req.body;

    const data: any = { name, description, price, stock, color, size };

    if (img) {
      data.img = img; // Só adiciona img se for fornecido
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    res.status(200).json({ message: "Produto atualizado!", updatedProduct });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar produto" });
  }
};

// Buscar produtos
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ error: "O parâmetro 'query' é obrigatório." });
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query as string,
 // Certifique-se de que o Prisma suporta 'mode'
        },
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};


export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verifica se o produto existe antes de deletar
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
};