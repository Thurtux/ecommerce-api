import express from "express";
import { createVariation, updateVariation, getVariationsByProduct, deleteVariation } from "../controllers/variationController";
import { validateVariation, validateVariationId } from "../middlewares/variationValidation";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// Criar uma variação (Apenas Admin)
router.post("/", verifyToken, isAdmin, validateVariation, createVariation);

// Listar variações de um produto (Usuários e Admins)
router.get("/:productId", getVariationsByProduct);

// Atualizar variação (Apenas Admin)
router.put("/:id", verifyToken, isAdmin, validateVariationId, validateVariation, updateVariation);

// Deletar variação (Apenas Admin)
router.delete("/:id", verifyToken, isAdmin, validateVariationId, deleteVariation);

export default router;
