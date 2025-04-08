import { Router } from "express";
import { createPaymentIntent, getTotalSales} from "../controllers/paymentController";
import { verifyToken } from "../middlewares/authMiddleware"; // Certifique-se de que este middleware esteja implementado corretamente

const router = Router();

// Rota protegida para criar uma Payment Intent
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

router.get("/total-sales", getTotalSales);

export default router;
