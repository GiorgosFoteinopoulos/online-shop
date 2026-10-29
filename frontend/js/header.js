import { getUser, clearSession, onAuthChange } from './auth.js';
import { cartCount, onCartChange } from './cart.js';
import { loginUrl } from './nav.js';

const badge = document.querySelector('#cart-count');

function updateBadge() {
    const count = cartCount();
    badge.textContent = count;
    badge.hidden = count === 0;
}

updateBadge();
onCartChange(updateBadge);

window.addEventListener('pageshow', updateBadge);

const currentPage = location.pathname.split('/').pop() || 'index.html';

const AUTH_PAGES = ['login.html', 'register.html'];

const accountArea = document.createElement('div');
accountArea.className = 'account-area';
document.querySelector('.cart-link').before(accountArea);

function renderAccount() {
    accountArea.replaceChildren();

    const user = getUser();
    if (user) {
        const greeting = document.createElement('span');
        greeting.className = 'account-greeting';
        greeting.textContent = `Hi, ${firstName(user.fullName)}`;

        const ordersLink = document.createElement('a');
        ordersLink.href = 'my-orders.html';
        ordersLink.className = 'account-nav';
        ordersLink.textContent = 'My orders';
        if (currentPage === 'my-orders.html') {
            ordersLink.setAttribute('aria-current', 'page');
        }


        const logoutButton = document.createElement('button');
        logoutButton.type = 'button';
        logoutButton.className = 'account-link';
        logoutButton.textContent = 'Log out';
        logoutButton.addEventListener('click', () => {
            clearSession();
            location.href = 'index.html';
        });

        accountArea.append(greeting, ordersLink, logoutButton);

    } else if (!AUTH_PAGES.includes(currentPage)) {
        const loginLink = document.createElement('a');
        loginLink.href = loginUrl();
        loginLink.className = 'account-link';
        loginLink.textContent = 'Log in';

        accountArea.append(loginLink);
    }
}

function firstName(fullname) {
    return fullname.trim().split(' ')[0];
}

renderAccount();
onAuthChange(renderAccount);
window.addEventListener('pageshow', renderAccount);

if (HTMLScriptElement.supports?.('speculationrules')) {
    const rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
        prefetch: [{
            where: { href_matches: '/*' },
            eagerness: 'moderate',
        }],
    });
    document.head.append(rules);
}