import './header.js';
import { fetchOrder } from './api.js';
import { formatPrice } from './format.js';

const view = document.querySelector('#order-view');
const messageBox = document.querySelector('#order-message');
const rowTemplate = document.querySelector('#order-row');

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short'});

const id = new URLSearchParams(window.location.search).get('id');
load();

async function load() {
    if (!id) {
        showMessage('Order not found.', 'This link does not point to an order.');
        return;
    }
    try {
        render(await fetchOrder(id));
    } catch (error) {
        showMessage('Order not found.', error.message);
    }
}

function render(order) {
    const reference = '#' + order.id.slice(0, 8).toUpperCase();

    document.querySelector('#order-name').textContent = order.customerName;
    document.querySelector('#order-ref').textContent = reference;
    document.querySelector('#order-email').textContent = order.customerEmail;
    document.querySelector('#order-status').textContent = order.status;
    document.querySelector('#order-date').textContent = dateFormat.format(new Date(order.createdAt));
    document.querySelector('#order-total').textContent = formatPrice(order.total);

    const rows = order.items.map(item => {
        const row = rowTemplate.content.firstElementChild.cloneNode(true);
        row.querySelector('.order-row-name').textContent = item.productName;
        row.querySelector('.order-row-qty').textContent = `${item.quantity} × ${formatPrice(item.unitPrice)}`;
        row.querySelector('.order-row-total').textContent = formatPrice(item.lineTotal);
        return row;
    });
    document.querySelector('#order-items').replaceChildren(...rows);

    view.hidden = false;
}

function showMessage(title, text) {
    const box = document.createElement('div');
    box.className = 'message';
    const heading = document.createElement('h3');
    const paragraph = document.createElement('p');
    heading.textContent = title;
    paragraph.textContent = text;
    box.append(heading, paragraph);
    messageBox.replaceChildren(box);
}