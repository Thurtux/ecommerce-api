const { db } = require("../config/firebaseConfig");

const favoriteCollection = db.collection("favorites");

// Adiciona um produto aos favoritos do usuário
async function addFavorite(userId, productId) {
    const userRef = favoriteCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        await userRef.set({ products: [productId] });
    } else {
        const favorites = userDoc.data().products || [];
        if (!favorites.includes(productId)) {
            await userRef.update({ products: [...favorites, productId] });
        }
    }
}

// Remove um produto dos favoritos do usuário
async function removeFavorite(userId, productId) {
    const userRef = favoriteCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return;

    const favorites = userDoc.data().products || [];
    const updatedFavorites = favorites.filter(id => id !== productId);

    await userRef.update({ products: updatedFavorites });
}

// Obtém os produtos favoritos do usuário
async function getFavorites(userId) {
    const userRef = favoriteCollection.doc(userId);
    const userDoc = await userRef.get();

    return userDoc.exists ? userDoc.data().products : [];
}

module.exports = { addFavorite, removeFavorite, getFavorites };
