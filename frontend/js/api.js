
const API_BASE = 'http://localhost:8080/api';


export class ApiError extends Error {
    constructor(status, problem) {
        super(problem?.detail ?? `Request failed (${status}).`);
        this.status = status;
        this.problem = problem ?? {};
    }
}


async function request(method, path, { params = {}, body } = {}) {
    const url = new URL(API_BASE + path);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    }

    const options = { method, headers: {} };
    if (body !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(url, options);
    } catch {
        throw new Error('Cannot reach the server. Is the backend running?');
    }

    if (!response.ok) {
        let problem = null;
        try {
            problem = await response.json();
        } catch {

        }
        throw new ApiError(response.status, problem);
    }
    return response.status === 204 ? null : response.json();
}

export const fetchCategories = () => request('GET', '/categories');
export const fetchProducts = (params) => request('GET', '/products', { params });
export const fetchProduct = (id) => request('GET', `/products/${id}`);
export const placeOrder = (order) => request('POST', '/orders', { body: order });
export const fetchOrder = (id) => request('GET', `/orders/${encodeURIComponent(id)}`);