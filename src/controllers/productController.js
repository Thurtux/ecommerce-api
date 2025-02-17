const ProductModel = require("../models/productModel");

// Criar produto
const createProduct = async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios!" });
    }

    const product = await ProductModel.create({ name, price, description, imageUrl });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um produto por ID
const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.getById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Atualizar um produto
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await ProductModel.update(req.params.id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um produto
const deleteProduct = async (req, res) => {
  try {
    const message = await ProductModel.delete(req.params.id);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
