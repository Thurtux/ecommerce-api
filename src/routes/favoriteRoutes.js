const express = require("express");
const router = express.Router();
const { addToFavorites, removeFromFavorites, listFavorites } = require("../controllers/favoriteController");

// Adicionar produto aos favoritos
router.post("/add", addToFavorites);

// Remover produto dos favoritos
router.post("/remove", removeFromFavorites);

// Listar produtos favoritos do usuário
router.get("/:userId", listFavorites);

module.exports = router;
