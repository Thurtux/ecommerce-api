import { body, ValidationChain } from "express-validator";

export const addItemValidation: ValidationChain[] = [
  body("productId")
    .notEmpty()
    .withMessage("O campo productId é obrigatório."),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("O campo quantity deve ser um número inteiro e pelo menos 1.")
];

export const updateItemValidation: ValidationChain[] = [
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("O campo quantity deve ser um número inteiro e pelo menos 1.")
];
