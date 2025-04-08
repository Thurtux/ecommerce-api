  import express from "express";
  import cors from "cors";
  import authRoutes from "./routes/authRoutes";
  import productRoutes from "./routes/productRoutes";
  import cartRoutes from "./routes/cartRoutes";
  import orderRoutes from "./routes/orderRoutes";
  import paymentRoutes from "./routes/paymentRoutes";
  import couponRoutes from "./routes/couponRoutes";
  import reviewRoutes from "./routes/reviewRoutes";
  import wishlistRoutes from "./routes/wishlistRoutes";
  import shippingRoutes from "./routes/shippingRoutes";

  const app = express();

  const allowedOrigins = ["http://localhost:5173", "https://adminecommerc.netlify.app/"];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // 🔥 Lida com preflight requests (corrigido)
  app.options("*", cors());

  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/products", productRoutes);
  app.use("/cart", cartRoutes);
  app.use("/orders", orderRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/coupons", couponRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/wishlist", wishlistRoutes);
  app.use("/shopping", shippingRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

  export default app;
