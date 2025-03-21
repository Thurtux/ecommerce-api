import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import variationRoutes from "./routes/variationRoutes";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/variations", variationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
