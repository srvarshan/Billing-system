// Cart functionality

// Get current cart
function getCart() {
    return getFromStorage(StorageKeys.CART, []);
}

// Add item to cart
function addToCart(menuItemId) {
    const menuItem = getMenuItemById(menuItemId);
    if (!menuItem) {
        return false;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === menuItemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image,
            quantity: 1
        });
    }

    saveToStorage(StorageKeys.CART, cart);
    return true;
}

// Remove item from cart
function removeFromCart(menuItemId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== menuItemId);
    saveToStorage(StorageKeys.CART, filteredCart);
    return filteredCart;
}

// Update item quantity in cart
function updateCartQuantity(menuItemId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(menuItemId);
    }

    const cart = getCart();
    const item = cart.find(item => item.id === menuItemId);
    if (item) {
        item.quantity = quantity;
        saveToStorage(StorageKeys.CART, cart);
    }
    return cart;
}

// Increment quantity
function incrementQuantity(menuItemId) {
    const cart = getCart();
    const item = cart.find(item => item.id === menuItemId);
    if (item) {
        item.quantity += 1;
        saveToStorage(StorageKeys.CART, cart);
    }
    return cart;
}

// Decrement quantity
function decrementQuantity(menuItemId) {
    const cart = getCart();
    const item = cart.find(item => item.id === menuItemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            return removeFromCart(menuItemId);
        }
        saveToStorage(StorageKeys.CART, cart);
    }
    return cart;
}

// Clear cart
function clearCart() {
    saveToStorage(StorageKeys.CART, []);
    return [];
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

