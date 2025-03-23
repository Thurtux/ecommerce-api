import { Router } from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";
import { verifyToken } from "../middlewares/authMiddleware";
import { addItemValidation, updateItemValidation } from "../middlewares/cartValidations";
import { validateRequest } from "../middlewares/validate";

const router = Router();

// Todas as rotas do carrinho estarão protegidas
router.use(verifyToken);

// Visualiza o carrinho do usuário
router.get("/", getCart);

// Adiciona um item ao carrinho com validação
router.post("/item", addItemValidation, validateRequest, addItemToCart);

// Atualiza a quantidade de um item com validação
router.put("/item/:id", updateItemValidation, validateRequest, updateCartItem);

// Remove um item do carrinho
router.delete("/item/:id", removeCartItem);

// Limpa o carrinho
router.delete("/", clearCart);

export default router;
