import './header.js';
import { placeOrder, ApiError } from './api.js';
import { getCart, clearCart, cartTotalCents } from './cart.js';
import { toCents, formatCents } from './format.js';

const form = document.querySelector('#checkout-form');
const alertBox = document.querySelector('#form-alert');
const submitButton = form.querySelector('button[type="submit"]');
const summaryItems = document.querySelector('#summary-items');
const summaryTotal = document.querySelector('#summary-total');

init();

function init() {
    if (getCart().length === 0) {
        window.location.replace('cart.html');     // nothing to check out
        return;
    }
    renderSummary();
    form.addEventListener('submit', submitOrder);
}

function renderSummary() {
    const rows = getCart().map(item => {
        const row = document.createElement('li');
        const name = document.createElement('span');
        name.textContent = `${item.quantity} × ${item.name}`;
        const price = document.createElement('span');
        price.textContent = formatCents(toCents(item.price) * item.quantity);
        row.append(name, price);
        return row;
    });
    summaryItems.replaceChildren(...rows);
    summaryTotal.textContent = formatCents(cartTotalCents());
}

async function submitOrder(event) {
    event.preventDefault();
    clearErrors();

    const data = new FormData(form);
    const order = {
        customerName: String(data.get('customerName') ?? '').trim(),
        customerEmail: String(data.get('customerEmail') ?? '').trim(),
        // Only WHICH product and HOW MANY: the server decides the prices.
        items: getCart().map(item => ({ productId: item.productId, quantity: item.quantity })),
    };

    setSubmitting(true);
    try {
        const placed = await placeOrder(order);
        clearCart();
        window.location.href = `order.html?id=${encodeURIComponent(placed.id)}`;
    } catch (error) {
        showError(error);
        setSubmitting(false);
    }
}

function showError(error) {
    if (error instanceof ApiError && error.status === 400 && error.problem.errors) {
        let shownUnderField = false;
        for (const [field, message] of Object.entries(error.problem.errors)) {
            const slot = form.querySelector(`[data-error-for="${field}"]`);
            if (slot) {
                slot.textContent = message;
                slot.hidden = false;
                form.elements[field]?.classList.add('invalid');
                shownUnderField = true;
            }
        }
        showAlert(shownUnderField ? 'Please check the highlighted fields.' : error.message);
    } else if (error instanceof ApiError && error.status === 409) {
        showAlert(error.message, true);           // e.g. "Only 4 left of Adjustable Dumbbells, requested 50."
    } else {
        showAlert(error.message);
    }
}

function showAlert(text, withCartLink = false) {
    const message = document.createElement('span');
    message.textContent = text + ' ';
    alertBox.replaceChildren(message);
    if (withCartLink) {
        const link = document.createElement('a');
        link.href = 'cart.html';
        link.textContent = 'Update your cart →';
        alertBox.append(link);
    }
    alertBox.hidden = false;
}

function clearErrors() {
    alertBox.hidden = true;
    form.querySelectorAll('.field-error').forEach(slot => { slot.hidden = true; slot.textContent = ''; });
    form.querySelectorAll('.invalid').forEach(input => input.classList.remove('invalid'));
}

function setSubmitting(submitting) {
    submitButton.disabled = submitting;           // no double orders from a double click
    submitButton.textContent = submitting ? 'Placing order…' : 'Place order';
}