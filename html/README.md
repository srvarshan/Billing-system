# South Indian Restaurant Website

A complete restaurant website for South Indian breakfast items with menu management, cart functionality, billing, and sales reporting.

## Features

### Customer Features
- **Menu Display**: Browse menu items with images, descriptions, and prices
- **Shopping Cart**: Add items to cart by clicking, manage quantities, remove items
- **Billing**: Generate and print bills
- **Payment**: Pay Now button with QR code for UPI payments
- **Cart Management**: Clear cart, increment/decrement quantities

### Admin Features
- **Menu Management**: Full CRUD operations (Create, Read, Update, Delete) for menu items
- **Sales Reports**: Monthly sales reports with:
  - Total orders and revenue
  - Average order value
  - Top 5 popular items
  - Detailed order history

## Project Structure

```
restaurant/
├── index.html          # Customer-facing menu page
├── admin.html          # Admin panel
├── css/
│   ├── style.css       # Customer interface styles
│   └── admin.css       # Admin panel styles
├── js/
│   ├── utils.js        # Utility functions (local storage, formatting)
│   ├── menu.js         # Menu CRUD operations
│   ├── cart.js         # Cart functionality
│   ├── billing.js      # Billing and payment
│   ├── main.js         # Customer interface logic
│   └── admin.js        # Admin panel logic
├── images/             # Menu item images and QR code
└── README.md
```

## Default Menu Items

The website comes pre-loaded with 4 South Indian breakfast items:
- **Idly** - ₹30
- **Dosa** - ₹50
- **Vada** - ₹25
- **Coffee** - ₹20

## Setup Instructions

1. Open `index.html` in a web browser to view the customer menu
2. Open `admin.html` in a web browser to access the admin panel
3. All data is stored in browser's Local Storage (no server required)

## Usage

### For Customers
1. Browse the menu on the main page
2. Click any menu item to add it to the cart
3. Manage cart items (quantity, remove)
4. Click "Pay Now" to see payment QR code
5. Click "Print Bill" to generate and print a bill

### For Admins
1. Navigate to `admin.html`
2. **Manage Menu**: Add, edit, or delete menu items
3. **Sales Reports**: Select a month to view sales statistics and order details

## Data Storage

All data is stored in browser Local Storage:
- `restaurant_menu`: Menu items
- `restaurant_cart`: Current cart
- `restaurant_orders`: Order history for reports

## Image Setup

Place menu item images in the `images/` folder:
- `idly.jpg`
- `dosa.jpg`
- `vada.jpg`
- `coffee.jpg`
- `qr-code.png` (for payment QR code)

If images are not found, placeholder images will be displayed automatically.

## Payment QR Code

Replace `images/qr-code.png` with your actual UPI QR code image. The payment modal displays:
- QR code image
- UPI ID: restaurant@upi (update in admin panel if needed)
- Account Number: 1234567890 (update in admin panel if needed)

## Browser Compatibility

Works on all modern browsers that support:
- HTML5
- CSS3
- ES6 JavaScript
- Local Storage API

## Notes

- No authentication required (admin panel accessible via direct URL)
- All data is stored locally in the browser
- Clearing browser data will reset all information
- For production use, consider adding authentication and server-side storage

