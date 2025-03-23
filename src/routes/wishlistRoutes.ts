import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Todas as rotas de wishlist devem ser protegidas (apenas usuários autenticados)
router.use(verifyToken);

// Obter a wishlist do usuário
router.get("/", getWishlist);

// Adicionar produto à wishlist
router.post("/", addToWishlist);

// Remover produto da wishlist (utiliza productId na URL)
router.delete("/:productId", removeFromWishlist);

export default router;
