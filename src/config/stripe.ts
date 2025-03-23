import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Utilize a versão exigida pelos tipos instalados
  apiVersion: "2025-02-24.acacia",
});

export default stripe;
