// script.js
const products = [
    { id: 1, name: "HoloPhone X-1", price: 1299.99 },
    { id: 2, name: "Levitation Case", price: 89.99 },
    { id: 3, name: "NeuroBuds Pro", price: 249.99 },
    { id: 4, name: "Plasma Charger Node", price: 149.99 },
    { id: 5, name: "Samsung Z Fold", price: 10750.00 },
    { id: 6, name: "iPhone 16", price: 14500.00 },
    { id: 7, name: "Quantum Watch S-1", price: 3499.99 },
    { id: 8, name: "HoloBeacon Mini", price: 899.99 },
    { id: 9, name: "Neural Link VR", price: 5999.99 },
    { id: 10, name: "Glass Tablet Ultra", price: 8750.00 },
    { id: 11, name: "Prism Projection Lens", price: 599.99 },
    { id: 12, name: "Aero-Magnetic Stand", price: 299.99 }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // Render initial empty cart message
    updateCartUI();

    // Add event listeners to all "Add to Cart" buttons
    const addButtons = document.querySelectorAll('.add-to-cart');
    
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
            
            // Add a quick pulse animation to the button
            const originalText = e.target.textContent;
            e.target.textContent = "Added!";
            e.target.style.background = "var(--neon-blue)";
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.background = "";
            }, 1000);
        });
    });

    // Checkout button event
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeBtn = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const modalTotal = document.getElementById('modal-total');

    if (checkoutBtn && modal) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                modalTotal.textContent = 'GH₵' + total.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                modal.style.display = 'block';
            } else {
                alert('Your cargo hold is empty!');
            }
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (checkoutForm && modal) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            alert(`Thanks for your purchase, ${name}! Your order is being processed.`);
            cart = [];
            updateCartUI();
            modal.style.display = 'none';
            checkoutForm.reset();
        });
    }
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        // Pulse animation for the cart count in header
        const cartCountSpan = document.getElementById('cart-count');
        if (cartCountSpan) {
            cartCountSpan.style.color = "#fff";
            cartCountSpan.style.textShadow = "0 0 15px var(--neon-cyan)";
            cartCountSpan.style.transform = "scale(1.5)";
            cartCountSpan.style.display = "inline-block";
            
            setTimeout(() => {
                cartCountSpan.style.color = "";
                cartCountSpan.style.textShadow = "";
                cartCountSpan.style.transform = "scale(1)";
            }, 300);
        }

        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Ensure function is available globally for inline onclick handlers inside the generated HTML
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total-price');
    const countElement = document.getElementById('cart-count');
    const summaryCountElement = document.getElementById('cart-item-count');

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li style="text-align:center; color: var(--text-muted); font-size: 1.1rem; padding: 20px 0;">Your cargo hold is currently empty.</li>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>GH₵${item.price.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div class="cart-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">–</button>
                        <span class="quantity-val">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">✕</button>
                </div>
            `;
            cartItemsContainer.appendChild(li);
        });
    }

    if (totalElement) totalElement.textContent = 'GH₵' + total.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (countElement) countElement.textContent = count;
    if (summaryCountElement) summaryCountElement.textContent = count;
}
