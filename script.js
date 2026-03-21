// script.js
const products = [
    { id: 1, name: "HoloPhone X-1", price: 1299.99 },
    { id: 2, name: "Levitation Case", price: 89.99 },
    { id: 3, name: "NeuroBuds Pro", price: 249.99 },
    { id: 4, name: "Plasma Charger Node", price: 149.99 },
    { id: 5, name: "Samsung Z Fold", price: 25999.00 }
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
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length > 0) {
                alert('Proceeding to hyper-secure checkout... Total: GH₵' + cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
                // Optional: clear cart after checkout
                cart = [];
                updateCartUI();
            } else {
                alert('Your cargo hold is empty!');
            }
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
                    <p>GH₵${item.price.toFixed(2)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="background: rgba(0,0,0,0.5); border-radius: 8px; border: 1px solid var(--glass-border); display: flex; align-items: center; overflow: hidden;">
                        <button onclick="changeQuantity(${item.id}, -1)" style="padding: 6px 12px; background: transparent; border: none; color: white; cursor:pointer;" onMouseOver="this.style.background='rgba(255,255,255,0.1)'" onMouseOut="this.style.background='transparent'">-</button>
                        <span style="color: white; padding: 0 10px;">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" style="padding: 6px 12px; background: transparent; border: none; color: white; cursor:pointer;" onMouseOver="this.style.background='rgba(255,255,255,0.1)'" onMouseOut="this.style.background='transparent'">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">✕</button>
                </div>
            `;
            cartItemsContainer.appendChild(li);
        });
    }

    if (totalElement) totalElement.textContent = 'GH₵' + total.toFixed(2);
    if (countElement) countElement.textContent = count;
    if (summaryCountElement) summaryCountElement.textContent = count;
}
