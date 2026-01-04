// Home.js - dynamic products from backend + cart + checkout

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. HEADER AND SESSION LOGIC ---

    const authSection = document.getElementById('auth-section');

    function handleLogout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    function checkUserSession() {
        const userDataString = localStorage.getItem('currentUser');

        if (userDataString) {
            const userData = JSON.parse(userDataString);

            authSection.innerHTML = `
                <span id="welcome-message">Welcome, ${userData.firstName}!</span>
                <button id="logout-btn" class="auth-btn">Logout</button>
            `;

            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            authSection.innerHTML = `
                <button onclick="window.location.href='index.html'">Login</button>
                <button onclick="window.location.href='Sign_up.html'">Signup</button>
            `;
        }
    }

    // --- 1. PRODUCT DATA (now loaded from backend) ---

    let allProducts = [];

    // --- 2. DOM ELEMENTS ---

    const productGrid        = document.getElementById('product-grid');
    const categoryButtons    = document.querySelectorAll('.category-btn');
    const searchInput        = document.getElementById('search-input');
    const sortSelect         = document.getElementById('sort-price');
    const clearFiltersBtn    = document.getElementById('clear-filters-btn');

    const cartSidebar        = document.getElementById('cart-sidebar');
    const cartOverlay        = document.getElementById('cart-overlay');
    const closeCartBtn       = document.getElementById('close-cart-btn');
    const cartBtn            = document.querySelector('.cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan      = document.getElementById('cart-total');

    const checkoutForm       = document.getElementById('checkout-form');
    const itemsJsonInput     = document.getElementById('items-json-input');
    const totalAmountInput   = document.getElementById('total-amount-input');

    let cart = [];

    // --- 3. CART LOGIC ---

    function calculateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalSpan.textContent = `₹${total.toFixed(2)}`;
        return total;
    }

    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            cartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Cart (0)';
            cartTotalSpan.textContent = '₹0.00';
            return;
        }

        const html = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-details">
                    <strong>${item.name}</strong>
                    <span>₹${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item-btn" data-id="${item.id}">&times;</button>
                </div>
            </div>
        `).join('');

        cartItemsContainer.innerHTML = html;

        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Cart (${itemCount})`;

        calculateCartTotal();
    }

    function addToCart(productId) {
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;

        const existing = cart.find(i => i.id == productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.imageUrl, // not used in DB, but useful later
                description: product.description,
                quantity: 1
            });
        }

        alert('Added to cart');
        renderCart();
    }

    function incrementQty(id) {
        const item = cart.find(i => i.id == id);
        if (!item) return;
        item.quantity++;
        renderCart();
    }

    function decrementQty(id) {
        const item = cart.find(i => i.id == id);
        if (!item) return;
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id != id);
        }
        renderCart();
    }

    function removeItem(id) {
        cart = cart.filter(i => i.id != id);
        renderCart();
    }

    function showCart() {
        cartSidebar.classList.remove('hidden');
        cartOverlay.classList.remove('hidden');
        renderCart();
    }

    function hideCart() {
        cartSidebar.classList.add('hidden');
        cartOverlay.classList.add('hidden');
    }

    // --- 4. RENDER PRODUCTS ---

    function renderProducts(list) {
        if (!list.length) {
            productGrid.innerHTML = `
                <p style="text-align:center;width:100%;font-size:1.2rem;color:#555;">
                    No products found.
                </p>`;
            return;
        }

        productGrid.innerHTML = list.map(p => `
            <div class="product-card" data-category="${p.category}">
                <img src="${p.imageUrl}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="card-actions">
                        <span class="price">₹${p.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- 5. FILTER + SORT ---

    let activeCategory = 'ALL';
    let searchTerm     = '';
    let sortOrder      = 'default';

    function applyFiltersAndSort() {
        let filtered = [...allProducts];

        if (activeCategory !== 'ALL') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(s) ||
                p.category.toLowerCase().includes(s)
            );
        }

        if (sortOrder === 'low-high') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'high-low') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered);
    }

    // --- 6. EVENT LISTENERS ---

    cartBtn.addEventListener('click', showCart);
    closeCartBtn.addEventListener('click', hideCart);
    cartOverlay.addEventListener('click', hideCart);

    cartItemsContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('plus')) {
            incrementQty(id);
        } else if (e.target.classList.contains('minus')) {
            decrementQty(id);
        } else if (e.target.classList.contains('remove-item-btn')) {
            removeItem(id);
        }
    });

    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = e.target.dataset.id;
            addToCart(id);
        }
    });

    // Checkout → send only item names + total
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (!cart.length) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }

        const userDataString = localStorage.getItem('currentUser');
        if (!userDataString) {
            alert('Please login before placing an order.');
            window.location.href = 'index.html';
            return;
        }

        const total = calculateCartTotal();
        const confirmOrder = confirm(`Your total is ₹${total.toFixed(2)}. Do you want to place the order?`);

        if (!confirmOrder) return;

        const itemNames = cart.map(item => item.name);
        const itemNamesString = itemNames.join(', ');

        itemsJsonInput.value   = itemNamesString;
        totalAmountInput.value = total.toFixed(2);

        checkoutForm.submit();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            applyFiltersAndSort();
        });
    });

    searchInput.addEventListener('input', () => {
        searchTerm = searchInput.value.trim();
        applyFiltersAndSort();
    });

    sortSelect.addEventListener('change', () => {
        sortOrder = sortSelect.value;
        applyFiltersAndSort();
    });

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchTerm = '';
            sortOrder = 'default';
            activeCategory = 'ALL';

            searchInput.value = '';
            sortSelect.value = 'default';

            categoryButtons.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-category="ALL"]').classList.add('active');

            applyFiltersAndSort();
        });
    }

    // --- 7. LOAD PRODUCTS FROM BACKEND ---

    function loadProductsFromServer() {
        fetch('products')    // relative to /ZeptoMart context → /ZeptoMart/products
            .then(res => res.json())
            .then(data => {
                // data is List<Product> from servlet
                allProducts = data;
                applyFiltersAndSort();
            })
            .catch(err => {
                console.error('Failed to load products', err);
                productGrid.innerHTML = `
                    <p style="text-align:center;width:100%;font-size:1.2rem;color:red;">
                        Failed to load products. Please try again later.
                    </p>`;
            });
    }

    // --- 8. INIT ---

    checkUserSession();
    loadProductsFromServer();
    renderCart();
});
