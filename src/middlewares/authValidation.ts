import { body, ValidationChain } from "express-validator";

export const validateRegister: ValidationChain[] = [
  body("email").isEmail().withMessage("O e-mail deve ser válido."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter no mínimo 6 caracteres."),
];

export const validateLogin: ValidationChain[] = [
  body("email").isEmail().withMessage("O e-mail deve ser válido."),
  body("password")
    .notEmpty()
    .withMessage("A senha é obrigatória."),
];
