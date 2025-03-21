import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { validateProduct } from "../middlewares/validationMiddleware";
import { handleValidationErrors } from "../middlewares/handleValidation";

const router = express.Router();

// Rotas abertas para todos os usuários
router.get("/", getProducts);
router.get("/:id", getProductById);

// Rotas protegidas (apenas admins podem acessar)
router.post("/", verifyToken, isAdmin, validateProduct, handleValidationErrors, createProduct);
router.put("/:id", verifyToken, isAdmin, validateProduct, handleValidationErrors, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
