const KEY = 'kimshop.session';

export function saveSession(loginResponse) {
    const session = {
        token: loginResponse.token,
        expiresAt: loginResponse.expiresAt,
        user: loginResponse.user,
    };
    localStorage.setItem(KEY, JSON.stringify(session));
    notifyChange();
}

export function getSession() {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
            return null;
    } try {
        const session = JSON.parse(raw);
        if (Date.parse(session.expiresAt) <= Date.now()) {
            clearSession();
            return null;
        }
        return session;
    } catch {
        clearSession();
        return null;
    }
}

export function getToken() {
    return getSession()?.token ?? null;
}

export function getUser() {
    return getSession()?.user ?? null;
}

export function isLoggedIn() {
    return getSession() !== null;
}

export function clearSession() {
    const hadSession = localStorage.getItem(KEY) !== null;
    localStorage.removeItem(KEY);
    if (hadSession) {
        notifyChange();
    }
}

export function onAuthChange(callback) {
    window.addEventListener('auth:changed', callback);
    window.addEventListener('storage', (event) => {
        if (event.key === KEY) {
            callback();
        }
    });
}

function notifyChange() {
    window.dispatchEvent(new CustomEvent('auth:changed'));
}
