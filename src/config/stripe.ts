import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config(); // Certifique-se de carregar o dotenv aqui

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export default stripe;