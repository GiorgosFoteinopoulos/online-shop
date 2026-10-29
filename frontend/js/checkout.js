import './header.js';
import { placeOrder, ApiError } from './api.js';
import { getCart, clearCart, cartTotalCents } from './cart.js';
import { toCents, formatCents } from './format.js';
import { getUser, isLoggedIn, onAuthChange } from './auth.js';
import { redirectToLogin } from './nav.js';


const form = document.querySelector('#checkout-form');
const alertBox = document.querySelector('#form-alert');
const submitButton = form.querySelector('button[type="submit"]');
const summaryItems = document.querySelector('#summary-items');
const summaryTotal = document.querySelector('#summary-total');
const orderingName = document.querySelector('#ordering-name');
const orderingEmail = document.querySelector('#ordering-email');

init();

function init() {
    if (getCart().length === 0) {
        window.location.replace('cart.html');     // nothing to check out
        return;
    }

    if (!isLoggedIn()) {
        redirectToLogin();
        return;
    }

    showCustomer();
    renderSummary();
    form.addEventListener('submit', submitOrder);

    onAuthChange(() => {
        if (!isLoggedIn()) {
            redirectToLogin();
        }
    });
}

function showCustomer() {
    const user = getUser();
    orderingName.textContent = user.fullName;
    orderingEmail.textContent = user.email;
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

    const order = {
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
        redirectToLogin();
    } else if (error instanceof ApiError && error.status === 409) {
        showAlert(error.message, true);          
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
    alertBox.replaceChildren();
}

function setSubmitting(submitting) {
    submitButton.disabled = submitting;       
    submitButton.textContent = submitting ? 'Placing order…' : 'Place order';
}