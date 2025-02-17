const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const router = express.Router();

// Criar um novo produto
router.post("/", createProduct);

// Obter todos os produtos
router.get("/", getAllProducts);

// Obter um produto específico por ID
router.get("/:id", getProductById);

// Atualizar um produto
router.put("/:id", updateProduct);

// Deletar um produto
router.delete("/:id", deleteProduct);

module.exports = router;
