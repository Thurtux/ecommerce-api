import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import variationRoutes from "./routes/variationRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import couponRoutes from "./routes/couponRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/variations", variationRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/coupons", couponRoutes);
app.use("/reviews", reviewRoutes);
app.use("/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
