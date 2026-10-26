import './header.js';
import { getCart, setQuantity, removeFromCart, clearCart, cartTotalCents, onCartChange } from './cart.js';
import { lookFor, toCents, formatCents } from './format.js';

const container = document.querySelector('#cart');
const rowTemplate = document.querySelector('#cart-row');

render();
onCartChange(render);   
function render() {
    const items = getCart();
    if (items.length === 0) {
        container.replaceChildren(emptyState());
        return;
    }
    const list = el('ul', 'cart-list');
    list.append(...items.map(createRow));
    container.replaceChildren(list, summary(items));
}
window.addEventListener('pageshow', render);

function createRow(item) {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    const look = lookFor(item.categorySlug);
    const unitCents = toCents(item.price);

    row.style.setProperty('--hue', look.hue);
    row.querySelector('.cart-thumb').textContent = look.emoji;

    const name = row.querySelector('.cart-name');
    name.textContent = item.name;
    name.href = `product.html?id=${item.productId}`;

    row.querySelector('.cart-unit').textContent = `${formatCents(unitCents)} each`;
    row.querySelector('.qty-value').textContent = item.quantity;
    row.querySelector('.cart-line-total').textContent = formatCents(unitCents * item.quantity);
    row.querySelector('[data-action="decrease"]').disabled = item.quantity <= 1;
    row.querySelector('[data-action="increase"]').disabled = item.quantity >= item.stock;

    
    row.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (action === 'increase') setQuantity(item.productId, item.quantity + 1);
        if (action === 'decrease') setQuantity(item.productId, item.quantity - 1);
        if (action === 'remove') removeFromCart(item.productId);
    });
    return row;
}

function summary(items) {
    const totalCents = cartTotalCents();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    const box = el('aside', 'cart-summary');
    box.append(
        el('h2', null, 'Order summary'),
        summaryLine(`Items (${count})`, formatCents(totalCents)),
        summaryLine('Shipping', 'Free'),
        summaryLine('Total', formatCents(totalCents), 'total'),
    );

    const checkout = el('a', 'btn-primary', 'Proceed to checkout');
    checkout.href = 'checkout.html';

    const clear = el('button', 'btn-link', 'Clear cart');
    clear.type = 'button';
    clear.addEventListener('click', () => {
        if (confirm('Remove all items from your cart?')) clearCart();
    });

    box.append(checkout, clear);
    return box;
}

function summaryLine(label, value, extraClass) {
    const line = el('div', extraClass ? `summary-line ${extraClass}` : 'summary-line');
    line.append(el('span', null, label), el('span', null, value));
    return line;
}

function emptyState() {
    const box = el('div', 'message');
    const link = el('a', 'btn-primary', 'Browse products');
    link.href = 'index.html';
    box.append(el('h3', null, 'Your cart is empty.'), el('p', null, 'Find something you like and add it here.'), link);
    return box;
}


function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}