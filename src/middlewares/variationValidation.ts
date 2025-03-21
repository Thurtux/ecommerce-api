import { body, param, ValidationChain } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateVariation: ValidationChain[] = [
  body("productId")
    .isUUID()
    .withMessage("O ID do produto deve ser um UUID válido.")
    .bail()
    .custom(async (value) => {
      const product = await prisma.product.findUnique({ where: { id: value } });
      if (!product) {
        throw new Error("Produto não encontrado.");
      }
    }),

  body("color")
    .notEmpty()
    .withMessage("A cor é obrigatória.")
    .isString()
    .withMessage("A cor deve ser uma string."),

  body("size")
    .notEmpty()
    .withMessage("O tamanho é obrigatório.")
    .isString()
    .withMessage("O tamanho deve ser uma string."),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("O estoque deve ser um número inteiro positivo."),
];

export const validateVariationId: ValidationChain[] = [
  param("id")
    .isUUID()
    .withMessage("O ID da variação deve ser um UUID válido."),
];
