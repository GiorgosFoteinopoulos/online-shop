import { cartCount, onCartChange } from './cart.js';

const badge = document.querySelector('#cart-count');

function updateBadge() {
    const count = cartCount();
    badge.textContent = count;
    badge.hidden = count === 0;
}

updateBadge();
onCartChange(updateBadge);

window.addEventListener('pageshow', updateBadge);