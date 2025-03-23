import { Request, Response, NextFunction } from "express";
import stripe from "../config/stripe";

// Cria uma Payment Intent para processar o pagamento
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, currency, paymentMethodTypes } = req.body;
    
    // Validação básica
    if (!amount || !currency) {
      res.status(400).json({ error: "Os campos 'amount' e 'currency' são obrigatórios." });
      return;
    }
    
    // Cria a Payment Intent; lembre-se que o valor deve estar em centavos (ex.: 1000 = R$10,00)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: paymentMethodTypes || ["card"],
    });
    
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
