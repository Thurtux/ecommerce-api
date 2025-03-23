import { Request, Response, NextFunction } from "express";
import { PrismaClient, Coupon } from "@prisma/client";

const prisma = new PrismaClient();

// Cria um novo cupom
export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, discount, expiresAt } = req.body;
      if (!code || discount === undefined) {
        res.status(400).json({ error: "Os campos 'code' e 'discount' são obrigatórios." });
        return;
      }
      
      // Verifica se o cupom já existe
      const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
      if (existingCoupon) {
        res.status(400).json({ error: "Um cupom com esse código já existe." });
        return;
      }
      
      const newCoupon: Coupon = await prisma.coupon.create({
        data: {
          code,
          discount,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });
  
      res.status(201).json(newCoupon);
    } catch (error) {
      next(error);
    }
  };

// Lista todos os cupons
export const getCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// Atualiza um cupom
export const updateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { code, discount, active, expiresAt } = req.body;

  try {
    const updatedCoupon = await prisma.coupon.update({
      where: { id: Number(id) },
      data: {
        code,
        discount,
        active,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.json(updatedCoupon);
  } catch (error) {
    next(error);
  }
};

// Remove um cupom
export const deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.coupon.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Aplica um cupom a um pedido (exemplo demonstrativo)
export const applyCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, orderTotal } = req.body;

    if (!code || orderTotal === undefined) {
      res.status(400).json({ error: "Os campos 'code' e 'orderTotal' são obrigatórios." });
      return;
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.active) {
      res.status(404).json({ error: "Cupom não encontrado ou inativo." });
      return;
    }

    // Verifica se o cupom expirou (se houver data de expiração)
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ error: "Cupom expirado." });
      return;
    }

    // Calcula o desconto (supondo que discount seja percentual)
    const discountValue = (orderTotal * coupon.discount) / 100;
    const newTotal = orderTotal - discountValue;

    res.json({
      coupon,
      discountValue,
      newTotal,
    });
  } catch (error) {
    next(error);
  }
};
