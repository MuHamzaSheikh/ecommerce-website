const products = [
    { id: 1, name: "Smartphone", category: "electronics", price: 599, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1nrSxkLfTyZI0V6wYm8QwohwhbPXut4nEBg&s", description: "Latest model with advanced features" },
    { id: 2, name: "T-Shirt", category: "clothing", price: 29, image: "https://assets.timberland.com/images/t_img/f_auto,h_650,w_650,e_sharpen:60/dpr_2.0/v1744894681/TB0A6DG5EOD-HERO/Illustrated-Tree-Logo-Back-Graphic-TShirt.png", description: "Comfortable cotton t-shirt" },
    { id: 3, name: "Watch", category: "accessories", price: 199, image: "https://dnstore.pk/cdn/shop/files/A5269DC7-FD85-4BE9-B509-50AA17D8C066.jpg?v=1750584638&width=1445", description: "Elegant wristwatch" },
    { id: 4, name: "Laptop", category: "electronics", price: 999, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT34Mw6RErXC9IIokLhQ_KWWZ5-m9knVacurQ&s", description: "High-performance laptop" },
    { id: 5, name: "Sci-Fi Novel", category: "books", price: 15, image: "https://www.nypl.org/scout/_next/image?url=https%3A%2F%2Fimages.btol.com%2FContentCafe%2FJacket.aspx%3FUserID%3DContentCafeClient%26Password%3DClient%26Return%3DT%26Type%3DL%26Value%3D9781933065397&w=3840&q=90", description: "Bestselling science fiction book" },
    { id: 6, name: "Cookware Set", category: "home-kitchen", price: 149, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbmhBUWZN2pxHySCHojVRW6O8KTPhS3tAQCA&s", description: "Non-stick cookware set" },
    { id: 7, name: "Yoga Mat", category: "sports-outdoors", price: 39, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKl9fD5fBJ01IkzXdbS_GV5cJtGJiwcwq6g&s", description: "Durable yoga mat for fitness" },
    { id: 8, name: "Headphones", category: "electronics", price: 89, image: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D", description: "Wireless noise-canceling headphones" },
    { id: 9, name: "Jacket", category: "clothing", price: 79, image: "https://deeds.pk/cdn/shop/files/New-Winter-Men-s-Hooded-Parkas-Windbreaker-Fashion-Thermal-Coats-Mens-Thick-Warm-Glossy-Black-Jackets_jpg_640x640_jpg.webp?v=1737463407", description: "Warm winter jacket" },
    { id: 10, name: "Sunglasses", category: "accessories", price: 129, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZsxthWMp11i8wQrsadRKm3OW8sGSNT7ExOA&s", description: "Stylish polarized sunglasses" },
    { id: 11, name: "Cookbook", category: "books", price: 25, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScB8FwF50nxUczOaNTdw5OJLra2l4yWgNVlw&s", description: "Recipes for home cooking" },
    { id: 12, name: "Camping Tent", category: "sports-outdoors", price: 199, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtag51b4MSEmX5qdAuQHI37nDZQyBE8kgzw&s", description: "Spacious tent for outdoor adventures" },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

// Page navigation
window.addEventListener('hashchange', showPage);
document.addEventListener('DOMContentLoaded', showPage);

function showPage() {
    const pages = ['home', 'products', 'product-details', 'cart', 'checkout', 'contact', 'account'];
    const hash = window.location.hash.slice(1) || 'home';
    pages.forEach(page => {
        document.getElementById(page).style.display = page === hash.split('/')[0] ? 'block' : 'none';
    });

    if (hash === 'home') displayFeaturedProducts();
    if (hash.startsWith('products')) {
        const category = hash.split('/')[1] || 'all';
        document.getElementById('category-filter').value = category;
        displayProducts();
    }
    if (hash === 'cart') displayCart();
    if (hash === 'checkout') displayCheckout();
    if (hash === 'account') displayAccountStatus();
    if (hash.startsWith('product-details/')) {
        const id = parseInt(hash.split('/')[1]);
        displayProductDetails(id);
    }
}

// Display featured products
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    container.innerHTML = products.slice(0, 6).map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="window.location.hash='#product-details/${product.id}'">View Details</button>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Display all products with search, filter, and sort
function displayProducts() {
    const container = document.getElementById('product-list');
    let filteredProducts = [...products];

    // Search
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQuery));
    }

    // Category filter
    const category = document.getElementById('category-filter').value;
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Sort
    const sort = document.getElementById('sort-filter').value;
    if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    container.innerHTML = filteredProducts.length > 0
        ? filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="window.location.hash='#product-details/${product.id}'">View Details</button>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `).join('')
        : '<p>No products found.</p>';

    // Event listeners for filters and search
    document.getElementById('search-input').addEventListener('input', displayProducts);
    document.getElementById('category-filter').addEventListener('change', displayProducts);
    document.getElementById('sort-filter').addEventListener('change', displayProducts);
}

// Display product details
function displayProductDetails(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const container = document.getElementById('product-details-content');
    container.innerHTML = `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="window.location.hash='#products'">Back to Products</button>
        </div>
    `;
}

// Cart management
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.hash === '#cart') displayCart();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function displayCart() {
    const container = document.getElementById('cart-items');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    container.innerHTML = cart.length > 0
        ? cart.map(item => `
            <div class="cart-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${item.price * item.quantity}</span>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('')
        : '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').innerHTML = cart.length > 0 ? `<strong>Total: $${total}</strong>` : '';
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Checkout
function displayCheckout() {
    const container = document.getElementById('checkout-cart');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    container.innerHTML = cart.length > 0
        ? cart.map(item => `
            <div class="cart-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${item.price * item.quantity}</span>
            </div>
        `).join('') + `<strong>Total: $${total}</strong>`
        : '<p>Your cart is empty.</p>';
}

function isLoggedIn() {
    return loggedInUser !== null;
}

function processCheckout() {
    if (!isLoggedIn()) {
        alert('Please log in to complete your purchase.');
        window.location.hash = '#account';
        return;
    }
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    if (document.getElementById('name').value && document.getElementById('address').value && document.getElementById('card').value) {
        alert('Purchase completed successfully!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        window.location.hash = '#home';
        document.getElementById('checkout-form').reset();
    } else {
        alert('Please fill in all fields.');
    }
}

// Contact form
function submitContact() {
    if (document.getElementById('contact-name').value && document.getElementById('contact-email').value && document.getElementById('message').value) {
        alert('Message sent successfully!');
        document.getElementById('contact-form').reset();
    } else {
        alert('Please fill in all fields.');
    }
}

// Account management
function displayAccountStatus() {
    const statusContainer = document.getElementById('account-status');
    const logoutButton = document.getElementById('logout-button');
    const accountForm = document.getElementById('account-form');
    if (isLoggedIn()) {
        statusContainer.innerHTML = `<p>Welcome, ${loggedInUser.email}! You are logged in.</p>`;
        logoutButton.style.display = 'inline-block';
        accountForm.style.display = 'none';
    } else {
        statusContainer.innerHTML = '<p>Please log in or create an account.</p>';
        logoutButton.style.display = 'none';
        accountForm.style.display = 'block';
    }
}

function createAccount() {
    const email = document.getElementById('account-email').value;
    const password = document.getElementById('account-password').value;
    if (email && password) {
        localStorage.setItem('user', JSON.stringify({ email, password }));
        alert('Account created successfully! Please log in.');
        document.getElementById('account-form').reset();
    } else {
        alert('Please fill in all fields.');
    }
}

function login() {
    const email = document.getElementById('account-email').value;
    const password = document.getElementById('account-password').value;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === email && user.password === password) {
        loggedInUser = { email };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        alert('Login successful!');
        document.getElementById('account-form').reset();
        displayAccountStatus();
    } else {
        alert('Invalid credentials.');
    }
}

function logout() {
    loggedInUser = null;
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully.');
    displayAccountStatus();
}

// Initialize cart count and account status
updateCartCount();
if (window.location.hash === '#account') displayAccountStatus();