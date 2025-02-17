const { db } = require("../config/firebaseConfig");

const cartCollection = db.collection("carts");

// Adiciona um produto ao carrinho
async function addToCart(userId, productId, quantity = 1) {
    const userRef = cartCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        await userRef.set({ products: [{ productId, quantity }] });
    } else {
        const cart = userDoc.data().products || [];
        const productIndex = cart.findIndex(p => p.productId === productId);

        if (productIndex > -1) {
            cart[productIndex].quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }

        await userRef.update({ products: cart });
    }
}

// Remove um produto do carrinho
async function removeFromCart(userId, productId) {
    const userRef = cartCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return;

    const cart = userDoc.data().products || [];
    const updatedCart = cart.filter(p => p.productId !== productId);

    await userRef.update({ products: updatedCart });
}

// Atualiza a quantidade de um produto no carrinho
async function updateCartQuantity(userId, productId, quantity) {
    const userRef = cartCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return;

    let cart = userDoc.data().products || [];
    const productIndex = cart.findIndex(p => p.productId === productId);

    if (productIndex > -1) {
        if (quantity > 0) {
            cart[productIndex].quantity = quantity;
        } else {
            cart = cart.filter(p => p.productId !== productId);
        }
        await userRef.update({ products: cart });
    }
}

// Obtém os produtos do carrinho do usuário
async function getCart(userId) {
    const userRef = cartCollection.doc(userId);
    const userDoc = await userRef.get();

    return userDoc.exists ? userDoc.data().products : [];
}

module.exports = { addToCart, removeFromCart, updateCartQuantity, getCart };
