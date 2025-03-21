import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar produto (Apenas Admin)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock } = req.body;

    const product = await prisma.product.create({
      data: { name, description, price, stock },
    });

    res.status(201).json({ message: "Produto criado com sucesso!", product });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar produto" });
  }
};

// Listar todos os produtos (Usuários e Admins)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};

// Buscar produto por ID (Usuários e Admins)
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

// Atualizar produto (Apenas Admin)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, price, stock },
    });

    res.status(200).json({ message: "Produto atualizado!", updatedProduct });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar produto" });
  }
};

// Deletar produto (Apenas Admin)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar produto" });
  }
};
