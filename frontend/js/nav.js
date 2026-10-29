const SAFE_PAGE = /^[a-z0-9-]+\.html(\?[a-z0-9=&-]*)?$/i;

function currentPage() {
    const page = location.pathname.split('/').pop() || 'index.html';
    return page + location.search;
}

export function redirectToLogin() {
    location.replace(`login.html?next=${encodeURIComponent(currentPage())}`);
}

export function safeNext() {
    const next = new URLSearchParams(location.search).get('next');
    return next && SAFE_PAGE.test(next) ? next : 'index.html';
}