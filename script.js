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

const PRINTER_VENDORS = [
    { vendorId: 0x0483 }, // Xprinter / STM
    { vendorId: 0x04b8 }, // Epson
    { vendorId: 0x0456 }, // Microtek
    { vendorId: 0x067b }  // Prolific
];

let selectedPrinter = null;

function setupEventListeners() {
    document.getElementById('checkout-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (cart.length > 0) {
            const btn = document.getElementById('checkout-btn');
            const originalText = btn.textContent;
            btn.textContent = "Processing...";
            btn.disabled = true;

            const orderNum = Math.floor(Math.random() * 99) + 1;
            const paddedNum = orderNum.toString().padStart(2, '0');

            try {
                // Try to print physical receipt
                const printed = await printUSBReceipt(paddedNum);

                if (printed) {
                    alert(`Order Number: #${paddedNum}\nReceipt printed! Thank you for your visit.`);
                } else {
                    // Fallback to just alert if printing was cancelled or failed but we continue
                    alert(`Order Number: #${paddedNum}\n(Digital Receipt) Thank you for your visit!`);
                }

                // Success flow
                cart = [];
                updateCart();
                if (document.getElementById('cart-modal').classList.contains('open')) {
                    toggleCart();
                }
            } catch (error) {
                console.error("Checkout error:", error);
                alert("Something went wrong with your order. Please try again.");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
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

async function printUSBReceipt(orderNum) {
    if (!navigator.usb) {
        console.warn("WebUSB not supported in this browser.");
        return false;
    }

    try {
        // Find or request device
        if (!selectedPrinter) {
            const devices = await navigator.usb.getDevices();
            selectedPrinter = devices.find(d => PRINTER_VENDORS.some(v => v.vendorId === d.vendorId));

            if (!selectedPrinter) {
                selectedPrinter = await navigator.usb.requestDevice({ filters: PRINTER_VENDORS });
            }
        }

        await selectedPrinter.open();
        if (selectedPrinter.configuration === null) {
            await selectedPrinter.selectConfiguration(1);
        }
        await selectedPrinter.claimInterface(0);

        const encoder = new TextEncoder();
        const receiptText = buildReceiptText(orderNum);

        // Find correct endpoint
        const endpoints = selectedPrinter.configuration.interfaces[0].alternates[0].endpoints;
        const outEndpoint = endpoints.find(e => e.direction === 'out');

        if (!outEndpoint) throw new Error("Output endpoint not found");

        await selectedPrinter.transferOut(outEndpoint.endpointNumber, encoder.encode(receiptText));

        // Brief delay before closing
        await new Promise(resolve => setTimeout(resolve, 500));
        await selectedPrinter.close();

        return true;
    } catch (error) {
        console.error("Printing failed:", error);
        // Important: we don't block the order even if printing fails, 
        // but we return false to indicate no physical receipt.
        return false;
    }
}

function buildReceiptText(orderNum) {
    let total = 0;
    let itemsText = "";

    cart.forEach(item => {
        const linePrice = (item.price * item.quantity).toFixed(2);
        total += item.price * item.quantity;

        // Formatting: "Qty x Name" padded to fit columns
        const namePart = `${item.quantity}x ${item.name}`.substring(0, 22);
        const pricePart = linePrice.padStart(8);
        itemsText += `${namePart.padEnd(22)}${pricePart}\n`;

        if (item.customizations && item.customizations.length > 0) {
            item.customizations.forEach(cust => {
                itemsText += `  - ${cust}\n`;
            });
        }
    });

    const dateStr = new Date().toLocaleString('nl-NL');

    return "\x1B\x40" +                     // Initialize printer
        "\x1B\x61\x01" +                   // Center align
        "\x1B\x21\x30" +                   // Double height/width
        "HAPPY HERBIVORE\n" +
        "\x1B\x21\x00" +                   // Reset font
        "Eet Smakelijk!\n" +
        "--------------------------------\n" +
        "\x1B\x61\x00" +                   // Left align
        `Bestelling: #${orderNum}\n` +
        `Datum: ${dateStr}\n` +
        "--------------------------------\n" +
        itemsText +
        "--------------------------------\n" +
        "\x1B\x21\x10" +                   // Bold
        `TOTAAL:          EUR ${total.toFixed(2).padStart(8)}\n` +
        "\x1B\x21\x00" +                   // Reset
        "--------------------------------\n" +
        "\x1B\x61\x01" +                   // Center align
        "\nBedankt voor uw bezoek!\n\n" +
        "\x1D\x56\x00";                    // Cut paper
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
    // We only group items together if they have EXACTLY the same customizations.
    // By default, new items have no customizations.
    const existingItem = cart.find(i => parseInt(i.product_id) === parseInt(productId) && (!i.customizations || i.customizations.length === 0));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Create a unique cart item ID
        cart.push({ ...item, quantity: 1, cartItemId: Date.now() + Math.random(), customizations: [] });
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

            let customizationsHtml = '';
            if (item.customizations && item.customizations.length > 0) {
                customizationsHtml = `<div class="customizations-text">${item.customizations.join(', ')}</div>`;
            }

            el.innerHTML = `
                <div style="flex: 1; padding-right: 15px;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.85rem; color: #777;">€${price.toFixed(2)}</div>
                    ${customizationsHtml}
                    <button class="customize-btn" onclick="openCustomizeModal('${item.cartItemId}')">Aanpassen</button>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty('${item.cartItemId}', -1)">-</button>
                    <span style="font-weight: 600; width: 20px; text-align: center;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty('${item.cartItemId}', 1)">+</button>
                </div>
            `;
            list.appendChild(el);
        }
    });

    const fmtTotal = `€${total.toFixed(2)}`;
    if (barTotal) barTotal.textContent = fmtTotal;
    if (modalTotal) modalTotal.textContent = fmtTotal;
}

function updateQty(cartItemId, change) {
    const itemIndex = cart.findIndex(i => i.cartItemId.toString() === cartItemId.toString());
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCart();
    }
}

let activeCustomizeItemId = null;

function openCustomizeModal(cartItemId) {
    activeCustomizeItemId = cartItemId;
    const item = cart.find(i => i.cartItemId.toString() === cartItemId.toString());

    // Reset all checkboxes
    document.querySelectorAll('.customize-checkbox').forEach(cb => {
        cb.checked = false;
        // Pre-check if this item already has these customizations
        if (item && item.customizations && item.customizations.includes(cb.value)) {
            cb.checked = true;
        }
    });

    document.getElementById('customize-modal').classList.add('open');
}

function closeCustomizeModal() {
    document.getElementById('customize-modal').classList.remove('open');
    activeCustomizeItemId = null;
}

function saveCustomizations() {
    if (!activeCustomizeItemId) return;

    const itemIndex = cart.findIndex(i => i.cartItemId.toString() === activeCustomizeItemId.toString());
    if (itemIndex === -1) return;

    const selectedOptions = Array.from(document.querySelectorAll('.customize-checkbox:checked')).map(cb => cb.value);

    // Check if there is another item in cart with the SAME product_id and SAME customizations
    // If so, merge them. Otherwise, update this item's customizations.
    const currentItem = cart[itemIndex];

    const matchingExistingIndex = cart.findIndex(i =>
        i.cartItemId !== currentItem.cartItemId &&
        i.product_id === currentItem.product_id &&
        JSON.stringify(i.customizations || []) === JSON.stringify(selectedOptions)
    );

    if (matchingExistingIndex !== -1) {
        // Merge into existing and remove this one
        cart[matchingExistingIndex].quantity += currentItem.quantity;
        cart.splice(itemIndex, 1);
    } else {
        // Just update this one
        cart[itemIndex].customizations = selectedOptions;
    }

    closeCustomizeModal();
    updateCart();
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
window.openCustomizeModal = openCustomizeModal;
window.closeCustomizeModal = closeCustomizeModal;
window.saveCustomizations = saveCustomizations;
