const CATEGORY_LOOK = {
    'electronics':     { emoji: '🎧', hue: 225 },
    'books':           { emoji: '📚', hue: 30 },
    'home-kitchen':    { emoji: '🍳', hue: 150 },
    'sports-outdoors': { emoji: '🏃', hue: 350 },
};

const DEFAULT_LOOK = { emoji: '🛍️', hue: 260 };

export const lookFor = (slug) => CATEGORY_LOOK[slug] ?? DEFAULT_LOOK;

const euro = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' });

export function toCents(price) {
    return Math.round(Number(price) * 100);
}

export function formatCents(cents) {
    return euro.format(cents / 100);
}

export function formatPrice(price) {
    return formatCents(toCents(price));
}