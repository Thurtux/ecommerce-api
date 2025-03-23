import { Router } from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getProductAverageRating,
} from "../controllers/reviewController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Rotas para criação, atualização e exclusão de reviews pelos usuários autenticados
router.post("/", verifyToken, createReview);
router.put("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

// Rotas públicas para consultar avaliações de um produto
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/average", getProductAverageRating);

/**
 * (Opcional) Rotas de moderação:
 * Exemplo: admin pode remover qualquer avaliação.
 */
// router.delete("/admin/:id", verifyToken, isAdmin, adminDeleteReview);
    
export default router;
