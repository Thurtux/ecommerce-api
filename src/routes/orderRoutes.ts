import { Router } from "express";
import { checkout, getOrders, getOrderById } from "../controllers/orderController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Todas as rotas de pedido estarão protegidas
router.use(verifyToken);

// Checkout: converte o carrinho em um pedido
router.post("/checkout", checkout);

// Lista os pedidos do usuário
router.get("/", getOrders);

// Detalhes de um pedido específico
router.get("/:id", getOrderById);

export default router;
