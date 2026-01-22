// Menu system with CRUD operations

// Default menu items for South Indian breakfast
const defaultMenuItems = [
    {
        id: '1',
        name: 'Idly',
        description: 'Soft and fluffy steamed rice cakes, served with sambar and coconut chutney',
        price: 30,
        image: 'images/idly.jpg',
        category: 'breakfast'
    },
    {
        id: '2',
        name: 'Dosa',
        description: 'Crispy fermented crepe made from rice and urad dal, served with sambar and chutney',
        price: 50,
        image: 'images/dosa.jpg',
        category: 'breakfast'
    },
    {
        id: '3',
        name: 'Vada',
        description: 'Crispy deep-fried lentil donuts, served with sambar and coconut chutney',
        price: 25,
        image: 'images/vada.jpg',
        category: 'breakfast'
    },
    {
        id: '4',
        name: 'Coffee',
        description: 'Traditional South Indian filter coffee, strong and aromatic',
        price: 20,
        image: 'images/coffee.jpg',
        category: 'beverage'
    }
];

// Initialize menu in storage if not exists
function initializeMenu() {
    const existingMenu = getFromStorage(StorageKeys.MENU);
    // Only initialize with defaults if localStorage is completely empty
    if (existingMenu === null || existingMenu === undefined) {
        saveToStorage(StorageKeys.MENU, defaultMenuItems);
        return defaultMenuItems;
    }
    // If menu exists in storage (even if empty array), return it as-is
    return Array.isArray(existingMenu) ? existingMenu : defaultMenuItems;
}

// Get all menu items
function getMenu() {
    const menu = getFromStorage(StorageKeys.MENU);
    if (!menu || menu.length === 0) {
        return initializeMenu();
    }
    return menu;
}

// Get menu item by ID
function getMenuItemById(id) {
    const menu = getMenu();
    return menu.find(item => item.id === id);
}

// Add new menu item
function addMenuItem(name, description, price, image, category = 'breakfast') {
    const menu = getMenu();
    const newItem = {
        id: generateId(),
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image: image,
        category: category
    };
    menu.push(newItem);
    saveToStorage(StorageKeys.MENU, menu);
    return newItem;
}

// Update menu item
function updateMenuItem(id, name, description, price, image, category) {
    const menu = getMenu();
    const index = menu.findIndex(item => item.id === id);
    if (index !== -1) {
        menu[index] = {
            ...menu[index],
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            image: image || menu[index].image,
            category: category || menu[index].category
        };
        saveToStorage(StorageKeys.MENU, menu);
        return menu[index];
    }
    return null;
}

// Delete menu item
function deleteMenuItem(id) {
    const menu = getMenu();
    const filteredMenu = menu.filter(item => item.id !== id);
    saveToStorage(StorageKeys.MENU, filteredMenu);
    return filteredMenu;
}

// Initialize menu on load
initializeMenu();

