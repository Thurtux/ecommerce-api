const express = require("express");
const router = express.Router();
const { addProductToCart, removeProductFromCart, updateProductQuantity, listCart } = require("../controllers/cartController");

// Adicionar produto ao carrinho
router.post("/add", addProductToCart);

// Remover produto do carrinho
router.post("/remove", removeProductFromCart);

// Atualizar quantidade de um produto no carrinho
router.post("/update", updateProductQuantity);

// Listar produtos do carrinho
router.get("/:userId", listCart);

module.exports = router;
