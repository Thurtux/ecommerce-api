import { body, ValidationChain } from "express-validator";

export const validateProduct: ValidationChain[] = [
  body("name").notEmpty().withMessage("O nome do produto é obrigatório."),
  body("description").optional().isString().withMessage("A descrição deve ser um texto."),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("O preço deve ser um número maior que zero."),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("O estoque deve ser um número inteiro maior ou igual a zero."),
];
