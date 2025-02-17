const { addFavorite, removeFavorite, getFavorites } = require("../models/favoriteModel");

// Adicionar produto aos favoritos
async function addToFavorites(req, res) {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: "userId e productId são obrigatórios." });
    }

    try {
        await addFavorite(userId, productId);
        res.status(200).json({ message: "Produto adicionado aos favoritos!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Remover produto dos favoritos
async function removeFromFavorites(req, res) {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: "userId e productId são obrigatórios." });
    }

    try {
        await removeFavorite(userId, productId);
        res.status(200).json({ message: "Produto removido dos favoritos!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Listar favoritos do usuário
async function listFavorites(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "userId é obrigatório." });
    }

    try {
        const favorites = await getFavorites(userId);
        res.status(200).json({ favorites });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addToFavorites, removeFromFavorites, listFavorites };
