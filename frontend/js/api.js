const API_BASE = 'http://localhost:8080/api';

async function getJson(path, params = {}) {
    const url = new URL(API_BASE + path);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value != null && value !== '') {
            url.searchParams.set(key, value);
        }
    }
    let response;
    try {
        response = await fetch (url);
    } catch {
        throw new Error('Cannot reach the server. Is the backend running?');
    }

    if (!response.ok) {
        let detail = `Request failed (${response.status}).`;
        try {
            const problem = await response.json();
            if (problem.detail) detail = problem.detail;
        } catch {

        }
        throw new Error(detail);
    }
    return response.json();
}

export const fetchCategories = () => getJson('/categories');
export const fetchProducts = (params) => getJson('/products', params);
export const fetchProduct = (id) => getJson(`/products/${id}`);