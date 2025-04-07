import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllProducts
} from "../controllers/productController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { validateProduct } from "../middlewares/validationMiddleware";
import { handleValidationErrors } from "../middlewares/handleValidation";

const router = express.Router();

// Coloque a rota de busca antes da rota com parâmetro :id
router.get("/search", searchProducts);

router.get("/", getAllProducts);

// Rotas protegidas (apenas admins podem acessar)
router.post("/", verifyToken, isAdmin, validateProduct, handleValidationErrors, createProduct);
router.put("/:id", verifyToken, isAdmin, validateProduct, handleValidationErrors, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
