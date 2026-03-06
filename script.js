const menuItems = typeof dbMenuItems !== 'undefined' ? dbMenuItems : [];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    renderMenu('all');
    setupEventListeners();
});

function hideStartScreen() {
    document.getElementById('start-screen').classList.add('hidden');
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('open');
}

function filterCategory(event, categoryId) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderMenu(categoryId);
}

function setupEventListeners() {
    document.getElementById('checkout-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal toggle if bubbling
        if (cart.length > 0) {
            const btn = document.getElementById('checkout-btn');
            const originalText = btn.textContent;
            btn.textContent = "Printing Ticket...";
            btn.style.backgroundColor = "#555";

            setTimeout(() => {
                const orderNum = Math.floor(Math.random() * 99) + 1;
                const paddedNum = orderNum.toString().padStart(2, '0');
                alert(`Order Number: #${paddedNum}\nPlease take your receipt!`);
                cart = [];
                updateCart();
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
                // toggleCart(); 
            }, 1000);
        } else {
            alert('Your tray is empty!');
        }
    });

    // Close modal when clicking outside
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'cart-modal') {
                toggleCart();
            }
        });
    }
}

function renderMenu(categoryId) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let delay = 0;
    const filteredItems = categoryId === 'all'
        ? menuItems
        : menuItems.filter(item => parseInt(item.category_id) === parseInt(categoryId));

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.style.animation = `fadeIn 0.4s ease-out ${delay}s forwards`;
        card.style.opacity = '0'; // For animation
        card.onclick = () => showExtras(item.product_id); // Entire card clickable
        card.innerHTML = `
            <img src="images/${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'">
            <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div style="font-size: 0.75rem; color: #777; margin-bottom: 0.5rem;">${item.kcal} kcal</div>
                <div style="font-size: 0.8rem; color: #555; margin-bottom: 1rem; line-height: 1.4;">${item.description}</div>
                <div class="item-price">€${parseFloat(item.price).toFixed(2)}</div>
                <button class="add-btn">
                    ADD +
                </button>
            </div>
        `;
        grid.appendChild(card);
        delay += 0.05;
    });

    // Add inline keyframes if not in CSS
    if (!document.getElementById('anim-style')) {
        const style = document.createElement('style');
        style.id = 'anim-style';
        style.innerHTML = `@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(10px); } }`;
        document.head.appendChild(style);
    }
}

let pendingProduct = null;

function showExtras(productId) {
    pendingProduct = menuItems.find(i => parseInt(i.product_id) === parseInt(productId));
    const extrasList = document.getElementById('extras-list');
    extrasList.innerHTML = '';

    // Filter for Sides (4) and Dips (5)
    const extras = menuItems.filter(i => [4, 5].includes(parseInt(i.category_id)));

    extras.forEach(extra => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <input type="checkbox" id="extra-${extra.product_id}" class="extra-checkbox" value="${extra.product_id}" style="width: 20px; height: 20px;">
                <label for="extra-${extra.product_id}">
                    <div style="font-weight: 600;">${extra.name}</div>
                    <div style="font-size: 0.85rem; color: #777;">€${parseFloat(extra.price).toFixed(2)}</div>
                </label>
            </div>
        `;
        row.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                const cb = row.querySelector('input');
                cb.checked = !cb.checked;
            }
        };
        extrasList.appendChild(row);
    });

    document.getElementById('extras-modal').classList.add('open');
}

function closeExtras() {
    document.getElementById('extras-modal').classList.remove('open');
    pendingProduct = null;
}

function addSelectedExtras() {
    if (!pendingProduct) return;

    // Add the main product
    addToCartSimple(pendingProduct.product_id);

    // Add selected extras
    const checkboxes = document.querySelectorAll('.extra-checkbox:checked');
    checkboxes.forEach(cb => {
        addToCartSimple(cb.value);
    });

    closeExtras();

    // Show feedback
    const bar = document.querySelector('.bottom-bar');
    bar.style.transform = 'scale(1.05)';
    setTimeout(() => bar.style.transform = 'scale(1)', 200);
}

function addToCartSimple(productId) {
    const item = menuItems.find(i => parseInt(i.product_id) === parseInt(productId));
    const existingItem = cart.find(i => parseInt(i.product_id) === parseInt(productId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}

function addToCart(event, productId) {
    event.stopPropagation();
    showExtras(productId);
}

function updateCart() {
    const list = document.getElementById('cart-items-list');
    const barTotal = document.getElementById('bar-total');
    const modalTotal = document.getElementById('modal-total');

    if (list) list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        if (list) list.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items yet.</p>`;
    }

    cart.forEach(item => {
        const price = parseFloat(item.price);
        total += price * item.quantity;
        if (list) {
            const el = document.createElement('div');
            el.className = 'cart-item-row';
            el.innerHTML = `
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.85rem; color: #777;">€${price.toFixed(2)}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${item.product_id}, -1)">-</button>
                    <span style="font-weight: 600; width: 20px; text-align: center;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${item.product_id}, 1)">+</button>
                </div>
            `;
            list.appendChild(el);
        }
    });

    const fmtTotal = `€${total.toFixed(2)}`;
    if (barTotal) barTotal.textContent = fmtTotal;
    if (modalTotal) modalTotal.textContent = fmtTotal;
}

function updateQty(productId, change) {
    const itemIndex = cart.findIndex(i => parseInt(i.product_id) === parseInt(productId));
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCart();
    }
}

// Global Exports
window.hideStartScreen = hideStartScreen;
window.filterCategory = filterCategory;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.toggleCart = toggleCart;
window.showExtras = showExtras;
window.closeExtras = closeExtras;
window.addSelectedExtras = addSelectedExtras;
