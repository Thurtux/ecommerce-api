import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import stripe from "../config/stripe";

const prisma = new PrismaClient();

// Cria uma Payment Intent e atualiza o status do pedido para "processing"
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Agora esperamos apenas orderId, currency e paymentMethodTypes
    const { orderId, currency, paymentMethodTypes } = req.body;

    if (!orderId || !currency) {
      res.status(400).json({ error: "Os campos 'orderId' e 'currency' são obrigatórios." });
      return;
    }

    // Busca o pedido no banco
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      res.status(404).json({ error: "Pedido não encontrado." });
      return;
    }

    if (order.status !== "pending") {
      res.status(400).json({ error: "O pedido já foi processado." });
      return;
    }

    // Usa o total do pedido (pode ser order.total + order.shippingCost, se necessário)
    const amount = Math.round(order.total); // Certifique-se de que o valor está em centavos, se for o caso

    // Cria a Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: paymentMethodTypes || ["card"],
      metadata: { orderId: orderId.toString() },
    });

    // Atualiza o status do pedido para "processing"
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "processing" },
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

// Webhook para atualizar o status do pedido após pagamento
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).json({ error: "Assinatura do webhook não encontrada." });
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error: any) {
    res.status(400).json({ error: `Erro no Webhook: ${error.message}` });
    return;
  }

  // Lida com os eventos do Stripe
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    // Atualiza o pedido como "completed"
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "completed" },
    });

    console.log(`Pagamento confirmado para o pedido ID: ${orderId}`);
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    // Atualiza o pedido como "failed"
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "failed" },
    });

    console.log(`Pagamento falhou para o pedido ID: ${orderId}`);
  }

  res.status(200).json({ received: true });
};
