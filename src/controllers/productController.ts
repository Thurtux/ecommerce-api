import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar produto (Apenas Admin)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, color, size, img } = req.body;

    const product = await prisma.product.create({
      data: { name, description, price, stock, color, size, img },
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
    const { name, description, price, stock, color, size, img } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, price, stock, color, size, img },
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

// Buscar produtos com filtros (name, minPrice, maxPrice, color, size)
export const searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, minPrice, maxPrice, color, size } = req.query;

    // Monta o whereClause dinamicamente
    const whereClause: any = {};

    // Filtro por nome (busca parcial, case-insensitive)
    if (name && typeof name === "string") {
      whereClause.name = { contains: name, mode: "insensitive" };
    }

    // Filtro por faixa de preço
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) {
        whereClause.price.gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        whereClause.price.lte = parseFloat(maxPrice as string);
      }
    }

    // Filtro por cor (case-insensitive)
    if (color && typeof color === "string") {
      whereClause.color = { equals: color };
    }

    // Filtro por tamanho (case-insensitive)
    if (size && typeof size === "string") {
      whereClause.size = { equals: size };
    }

    // Busca os produtos com os filtros aplicados
    const products = await prisma.product.findMany({
      where: whereClause,
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
