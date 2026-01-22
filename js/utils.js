// Utility functions for Local Storage operations

const StorageKeys = {
    MENU: 'restaurant_menu',
    CART: 'restaurant_cart',
    ORDERS: 'restaurant_orders'
};

// Save data to Local Storage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
}

// Get data from Local Storage
function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return defaultValue;
    }
}

// Clear specific storage key
function clearStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toFixed(2);
}

// Format date
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get month name from date
function getMonthName(date) {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

