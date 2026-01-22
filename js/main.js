// Main script for customer interface

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    loadCart();
    setupEventListeners();
});

// Load and display menu
function loadMenu() {
    const menu = getMenu();
    const menuGrid = document.getElementById('menuGrid');
    
    if (menu.length === 0) {
        menuGrid.innerHTML = '<p>No menu items available.</p>';
        return;
    }

    menuGrid.innerHTML = menu.map(item => `
        <div class="menu-item" onclick="addItemToCart('${item.id}')">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'200\'%3E%3Crect width=\'300\' height=\'200\' fill=\'%23f3f4f6\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\' font-family=\'Arial\' font-size=\'16\' fill=\'%23666\'%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p class="menu-description">${item.description}</p>
                <p class="menu-price">${formatCurrency(item.price)}</p>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addItemToCart(menuItemId) {
    addToCart(menuItemId);
    loadCart();
    showCartNotification();
}

// Show cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Load and display cart
function loadCart() {
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cart = getCart();
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');

    cartCount.textContent = getCartItemCount();
    cartTotal.textContent = formatCurrency(getCartTotal());

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        clearCartBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatCurrency(item.price)} × ${item.quantity} = ${formatCurrency(item.price * item.quantity)}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="decrementCartItem('${item.id}')" class="btn-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="incrementCartItem('${item.id}')" class="btn-quantity">+</button>
                    <button onclick="removeCartItem('${item.id}')" class="btn-remove">Remove</button>
                </div>
            </div>
        `).join('');
        clearCartBtn.disabled = false;
    }
}

// Cart item actions
function incrementCartItem(menuItemId) {
    incrementQuantity(menuItemId);
    updateCartDisplay();
}

function decrementCartItem(menuItemId) {
    decrementQuantity(menuItemId);
    updateCartDisplay();
}

function removeCartItem(menuItemId) {
    removeFromCart(menuItemId);
    updateCartDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Clear cart button
    document.getElementById('clearCartBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the cart?')) {
            clearCart();
            updateCartDisplay();
        }
    });

    // Pay now button
    document.getElementById('payNowBtn').addEventListener('click', showPaymentModal);

    // Print bill button
    document.getElementById('printBillBtn').addEventListener('click', printBill);

    // Close modal when clicking outside
    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePaymentModal();
        }
    });
}

