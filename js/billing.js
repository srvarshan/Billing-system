// Billing and checkout functionality

// Save order to history
function saveOrder(cart, total) {
    const orders = getFromStorage(StorageKeys.ORDERS, []);
    const order = {
        id: generateId(),
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total,
        date: new Date().toISOString()
    };
    orders.push(order);
    saveToStorage(StorageKeys.ORDERS, orders);
    return order;
}

// Generate bill HTML for printing
function generateBillHTML(cart, total) {
    const date = new Date();
    const billNumber = 'BILL-' + date.getTime().toString().slice(-8);
    
    let itemsHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(itemTotal)}</td>
            </tr>
        `;
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill - ${billNumber}</title>
            <style>
                @media print {
                    body { margin: 0; padding: 20px; }
                    .no-print { display: none; }
                }
                body {
                    font-family: Arial, sans-serif;
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0;
                    color: #d97706;
                }
                .bill-info {
                    margin-bottom: 20px;
                }
                .bill-info p {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table th, table td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                table th {
                    background-color: #f3f4f6;
                    font-weight: bold;
                }
                .total {
                    text-align: right;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 10px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                }
                .no-print {
                    text-align: center;
                    margin-top: 20px;
                }
                button {
                    padding: 10px 20px;
                    background-color: #d97706;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background-color: #b45309;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>South Indian Restaurant</h1>
                <p>Breakfast Specialists</p>
            </div>
            <div class="bill-info">
                <p><strong>Bill No:</strong> ${billNumber}</p>
                <p><strong>Date:</strong> ${formatDate(date)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            <div class="total">
                <p>Grand Total: ${formatCurrency(total)}</p>
            </div>
            <div class="footer">
                <p>Thank you for visiting!</p>
                <p>Visit us again for delicious South Indian breakfast</p>
            </div>
            <div class="no-print">
                <button onclick="window.print()">Print Bill</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `;
}

// Print bill
function printBill() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const total = getCartTotal();
    const billHTML = generateBillHTML(cart, total);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(billHTML);
    printWindow.document.close();
    
    // Save order to history
    saveOrder(cart, total);
    
    // Clear cart after printing
    setTimeout(() => {
        clearCart();
        if (typeof updateCartDisplay === 'function') {
            updateCartDisplay();
        }
    }, 500);
}

// Show payment QR code modal
function showPaymentModal() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const total = getCartTotal();
    const modal = document.getElementById('paymentModal');
    if (modal) {
        document.getElementById('paymentTotal').textContent = formatCurrency(total);
        modal.style.display = 'flex';
    }
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Complete payment (after showing QR code)
function completePayment() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const total = getCartTotal();
    
    // Save order
    saveOrder(cart, total);
    
    // Clear cart
    clearCart();
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
    
    // Close modal
    closePaymentModal();
    
    alert('Payment completed! Order saved.');
}

