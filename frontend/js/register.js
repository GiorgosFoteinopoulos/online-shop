import './header.js';
import { register, login, ApiError } from './api.js';
import { saveSession, isLoggedIn  } from './auth.js';
import { safeNext } from './nav.js';

const form = document.querySelector('#register-form');
const alertBox = document.querySelector('#form-alert');
const submitButton = form.querySelector('button[type="submit"]');

if (isLoggedIn()) {
    location.replace(safeNext());
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const data = new FormData(form);
    const account = {
        fullName: data.get('fullName').trim(),
        email: data.get('email').trim(),
        password: data.get('password'),
    };

    if (account.password !== data.get('confirmPassword')) {
        showFieldError('confirmPassword', 'Passwords do not match');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';

    try {
        await register(account);
        const session = await login({
            email: account.email,
            password: account.password,
        });
        saveSession(session);
        location.replace(safeNext());
    } catch (error) {
        showProblem(error);
        submitButton.disabled = false;
        submitButton.textContent = 'Create account';
    }
});

function showProblem(error) {
    if (error instanceof ApiError && error.status === 400 && error.problem.errors) {
        for (const [field, message] of Object.entries(error.problem.errors)) {
            showFieldError(field, message);
        }
        return;
    }
    showAlert(error.message);
}

function showFieldError(field, message) {
    const slot = form.querySelector(`[data-error-for="${field}"]`);
    if (slot) {
        slot.textContent = message;
        slot.hidden = false;
    } else {
        showAlert(message);
    }
}

function showAlert(message) {
    alertBox.textContent = message;
    alertBox.hidden = false;
}

function clearErrors() {
    alertBox.hidden = true;
    alertBox.textContent = '';
    for (const slot of form.querySelectorAll('.field-error')) {
        slot.hidden = true;
        slot.textContent = '';
    }
}


function safeNext() {
    const next = new URLSearchParams(location.search).get('next');
    return next && /^[a-z0-9-]+\.html$/i.test(next) ? next : 'index.html';
}