import { Router } from "express";
import { createPaymentIntent, handleStripeWebhook } from "../controllers/paymentController";

const router = Router();

// Rota para criar uma Payment Intent e iniciar o pagamento
router.post("/payments", createPaymentIntent);

// Webhook do Stripe para atualizações automáticas de status de pagamento
router.post("/webhook/stripe", handleStripeWebhook);

export default router;
