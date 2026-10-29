import './header.js';
import { fetchMyOrders, ApiError } from './api.js';
import { formatPrice } from './format.js';
import { isLoggedIn, onAuthChange } from './auth.js';
import { redirectToLogin } from './nav.js';

const list = document.querySelector('#orders-list');
const messageBox = document.querySelector('#orders-message');
const cardTemplate = document.querySelector('#order-card');

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

load();

async function load() {
    
    if (!isLoggedIn()) {
        redirectToLogin();
        return;
    }

    onAuthChange(() => {
        if (!isLoggedIn) {
            redirectToLogin();
        }
    });

    try {
        const orders = await fetchMyOrders();

        if (orders.length === 0) {
            showMessage('No orders yet.', 'When you place an order, it will appear here.', true);
            return;
        }

        messageBox.replaceChildren();
        list.replaceChildren(...orders.map(createCard));
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            redirectToLogin();
            return;
        }
        showMessage('Could not load your orders.', error.message);
    }
}

function createCard(order) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.href = `order.html?id=${encodeURIComponent(order.id)}`;

    card.querySelector('.order-card-ref').textContent = '#' + order.id.slice(0, 8).toUpperCase();
    card.querySelector('.order-card-date').textContent = dateFormat.format(new Date(order.createdAt));
    card.querySelector('.order-card-status').textContent = order.status;

    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    card.querySelector('.order-card-items').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;

    card.querySelector('.order-card-total').textContent = formatPrice(order.total);
    return card;
}

function showMessage(title, text, withShopLink = false) {
    const box = document.createElement('div');
    box.className = 'message';

    const heading = document.createElement('h3');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    box.append(heading, paragraph);

    if (withShopLink) {
        const link = document.createElement('a');
        link.href = 'index.html';
        link.className = 'btn-primary';
        link.textContent = 'Start shopping';
        box.append(link);
    }

    messageBox.replaceChildren(box);
}