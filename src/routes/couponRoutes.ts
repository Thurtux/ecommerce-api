import { Router } from "express";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

/**
 * Rotas de administração de cupons
 * Apenas administradores podem criar, atualizar, excluir e listar todos os cupons.
 */
router.use("/admin", verifyToken, isAdmin);

// Criar um novo cupom (Admin)
router.post("/admin", createCoupon);

// Atualizar um cupom existente (Admin)
router.put("/admin/:id", updateCoupon);

// Excluir um cupom (Admin)
router.delete("/admin/:id", deleteCoupon);

// Listar todos os cupons (Admin)
router.get("/admin", getCoupons);

/**
 * Rota para aplicação de cupom
 * Disponível para usuários autenticados.
 */
router.post("/apply", verifyToken, applyCoupon);

export default router;
