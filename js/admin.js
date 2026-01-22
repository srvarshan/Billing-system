// Admin panel functionality

let editingItemId = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadMenuList();
    setupFormListener();
    
    // Set default month to current month
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    document.getElementById('reportMonth').value = `${now.getFullYear()}-${month}`;
});

// Show section
function showSection(sectionName, btn) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // Show selected section (if it exists)
    const sectionEl = document.getElementById(sectionName + 'Section');
    if (sectionEl) {
        sectionEl.classList.add('active');
    }
    
    // Add active class to clicked button (use provided btn or fallback)
    if (btn && btn.classList) {
        btn.classList.add('active');
    } else {
        // fallback: try to find a nav button that calls showSection for this section
        try {
            const selector = ".nav-btn[onclick*=\"showSection('" + sectionName + "')\"]";
            const fallbackBtn = document.querySelector(selector);
            if (fallbackBtn) fallbackBtn.classList.add('active');
        } catch (e) {
            // ignore selector errors
        }
    }
    
    // Load data if needed
    if (sectionName === 'reports') {
        loadSalesReport();
    } else if (sectionName === 'menu') {
        loadMenuList();
    }
}

// Setup form listener
function setupFormListener() {
    document.getElementById('menuForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMenuItem();
    });
}

// Load menu list
function loadMenuList() {
    const menu = getMenu();
    const menuList = document.getElementById('menuList');
    
    if (menu.length === 0) {
        menuList.innerHTML = '<p class="no-data">No menu items. Add your first item above.</p>';
        return;
    }
    
    menuList.innerHTML = menu.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'100\'%3E%3Crect width=\'150\' height=\'100\' fill=\'%23f3f4f6\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\' font-family=\'Arial\' font-size=\'12\' fill=\'%23666\'%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="menu-item-details">
                <h4>${item.name}</h4>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <span class="item-price">${formatCurrency(item.price)}</span>
                    <span class="item-category">${item.category}</span>
                </div>
            </div>
            <div class="menu-item-actions">
                <button onclick="editMenuItem('${item.id}')" class="btn btn-edit">Edit</button>
                <button onclick="deleteMenuItemConfirm('${item.id}')" class="btn btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

// Save menu item (add or update)
function saveMenuItem() {
    const id = document.getElementById('menuItemId').value;
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const price = document.getElementById('itemPrice').value;
    const image = document.getElementById('itemImage').value || 'images/default.jpg';
    const category = document.getElementById('itemCategory').value;
    
    if (id) {
        // Update existing item
        updateMenuItem(id, name, description, price, image, category);
    } else {
        // Add new item
        addMenuItem(name, description, price, image, category);
    }
    
    resetForm();
    loadMenuList();
    showNotification('Menu item saved successfully!');
}

// Edit menu item
function editMenuItem(id) {
    const item = getMenuItemById(id);
    if (!item) return;
    
    editingItemId = id;
    document.getElementById('menuItemId').value = id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemImage').value = item.image;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('formTitle').textContent = 'Edit Menu Item';
    document.getElementById('submitBtn').textContent = 'Update Item';
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Delete menu item with confirmation
function deleteMenuItemConfirm(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        deleteMenuItem(id);
        loadMenuList();
        showNotification('Menu item deleted successfully!');
    }
}

// Reset form
function resetForm() {
    editingItemId = null;
    document.getElementById('menuForm').reset();
    document.getElementById('menuItemId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Menu Item';
    document.getElementById('submitBtn').textContent = 'Add Item';
}

// Load sales report
function loadSalesReport() {
    const monthInput = document.getElementById('reportMonth').value;
    if (!monthInput) {
        document.getElementById('reportContent').innerHTML = '<p class="no-data">Please select a month</p>';
        return;
    }
    
    const orders = getFromStorage(StorageKeys.ORDERS, []);
    const [year, month] = monthInput.split('-');
    
    // Filter orders for selected month
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getFullYear() == year && (orderDate.getMonth() + 1) == month;
    });
    
    if (monthOrders.length === 0) {
        document.getElementById('reportContent').innerHTML = `
            <p class="no-data">No orders found for ${getMonthName(new Date(year, month - 1))}</p>
        `;
        return;
    }
    
    // Calculate statistics
    const totalOrders = monthOrders.length;
    const totalRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Get popular items
    const itemCounts = {};
    monthOrders.forEach(order => {
        order.items.forEach(item => {
            if (itemCounts[item.name]) {
                itemCounts[item.name] += item.quantity;
            } else {
                itemCounts[item.name] = item.quantity;
            }
        });
    });
    
    const popularItems = Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    // Generate report HTML
    const reportHTML = `
        <div class="report-summary">
            <div class="summary-card">
                <h3>Total Orders</h3>
                <p class="stat-value">${totalOrders}</p>
            </div>
            <div class="summary-card">
                <h3>Total Revenue</h3>
                <p class="stat-value">${formatCurrency(totalRevenue)}</p>
            </div>
            <div class="summary-card">
                <h3>Average Order Value</h3>
                <p class="stat-value">${formatCurrency(totalRevenue / totalOrders)}</p>
            </div>
        </div>
        
        <div class="popular-items">
            <h3>Top 5 Popular Items</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                    </tr>
                </thead>
                <tbody>
                    ${popularItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="order-details">
            <h3>Order Details</h3>
            <div class="orders-list">
                ${monthOrders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <span><strong>Order ID:</strong> ${order.id}</span>
                            <span><strong>Date:</strong> ${formatDate(order.date)}</span>
                            <span><strong>Total:</strong> ${formatCurrency(order.total)}</span>
                        </div>
                        <div class="order-items">
                            ${order.items.map(item => `
                                <span>${item.name} (${item.quantity} × ${formatCurrency(item.price)})</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('reportContent').innerHTML = reportHTML;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

