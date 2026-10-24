import { toCents } from './format.js';

const STORAGE_KEY = 'kimshop.cart';
const CHANGED_EVENT = 'cart:changed';


export function getCart() {
    try {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(items) ? items : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
}

export function addToCart(product, quantity) {
    const items = getCart();
    const existing = items.find(item => item.productId === product.id);
    if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
        existing.price = product.price;
        existing.stock = product.stock;
    } else {
        items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            categorySlug: product.category.slug,
            quantity: Math.min(quantity, product.stock),

        });
      }
    saveCart(items);
}

export function setQuantity(productId, quantity) {
    const items = getCart();
    const item = items.find(i => i.productId === productId);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(quantity, item.stock));
    saveCart(items);
}

export function removeFromCart(productId) {
    saveCart(getCart().filter(item => item.productId !== productId));
}

export function clearCart() {
    saveCart([]);
}

export function cartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotalCents() {
    return getCart().reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0);
}

export function onCartChange(listener) {
    window.addEventListener(CHANGED_EVENT, listener);
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            listener();
        }
    });
}