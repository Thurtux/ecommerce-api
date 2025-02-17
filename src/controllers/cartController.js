const { addToCart, removeFromCart, updateCartQuantity, getCart } = require("../models/cartModel");

// Adicionar produto ao carrinho
async function addProductToCart(req, res) {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 1) {
        return res.status(400).json({ error: "userId, productId e quantity são obrigatórios e devem ser válidos." });
    }

    try {
        await addToCart(userId, productId, quantity);
        res.status(200).json({ message: "Produto adicionado ao carrinho!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Remover produto do carrinho
async function removeProductFromCart(req, res) {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: "userId e productId são obrigatórios." });
    }

    try {
        await removeFromCart(userId, productId);
        res.status(200).json({ message: "Produto removido do carrinho!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Atualizar quantidade de um produto no carrinho
async function updateProductQuantity(req, res) {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 0) {
        return res.status(400).json({ error: "userId, productId e quantity são obrigatórios e devem ser válidos." });
    }

    try {
        await updateCartQuantity(userId, productId, quantity);
        res.status(200).json({ message: "Quantidade do produto atualizada!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Listar carrinho do usuário
async function listCart(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "userId é obrigatório." });
    }

    try {
        const cart = await getCart(userId);
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addProductToCart, removeProductFromCart, updateProductQuantity, listCart };
