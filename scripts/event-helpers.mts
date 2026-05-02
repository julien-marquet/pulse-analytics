// scripts/event-helpers.ts

export const EVENT_WEIGHTS: [string, number][] = [
    ['PAGE_VIEWED', 30],
    ['PAGE_EXITED', 20],
    ['BUTTON_CLICKED', 12],
    ['LINK_CLICKED', 10],
    ['TAB_SWITCHED', 6],
    ['FORM_STARTED', 5],
    ['FORM_SUBMITTED', 4],
    ['MODAL_OPENED', 3],
    ['MODAL_CLOSED', 3],
    ['DROPDOWN_SELECTED', 2],
    ['TOOLTIP_HOVERED', 2],
    ['ACCORDION_EXPANDED', 1],
    ['CHECKOUT_COMPLETED', 1],
    ['PURCHASE_COMPLETED', 1],
    ['VIDEO_PLAYED', 1],
    ['VIDEO_PAUSED', 1],
    ['VIDEO_COMPLETED', 1],
    ['FILE_DOWNLOADED', 1],
    ['USER_SIGNED_UP', 1],
    ['USER_LOGGED_IN', 1],
    ['USER_LOGGED_OUT', 1],
    ['PASSWORD_RESET_REQUESTED', 1],
    ['ERROR_SHOWN', 1],
    ['API_ERROR_OCCURRED', 1],
];

export const URLS = [
    '/',
    '/home',
    '/about',
    '/pricing',
    '/contact',
    '/blog',
    '/blog/getting-started',
    '/blog/top-10-features',
    '/docs',
    '/docs/api-reference',
    '/docs/quickstart',
    '/login',
    '/signup',
    '/forgot-password',
    '/dashboard',
    '/dashboard/overview',
    '/dashboard/analytics',
    '/dashboard/settings',
    '/products',
    '/products/plan-basic',
    '/products/plan-pro',
    '/products/plan-enterprise',
    '/cart',
    '/checkout',
    '/checkout/confirmation',
    '/account',
    '/account/profile',
    '/account/billing',
    '/account/security',
    '/search',
    '/404',
];

// Fixed pool of users so the same IDs recur, simulating returning visitors
export const USER_POOL = Array.from({ length: 60 }, () => crypto.randomUUID());

export function weightedRandom<T>(weighted: [T, number][]): T {
    const total = weighted.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [item, w] of weighted) {
        r -= w;
        if (r <= 0) return item;
    }
    return weighted[0][0];
}

export function generateEvent(emittedAt: string) {
    return {
        type: weightedRandom(EVENT_WEIGHTS),
        emittedAt,
        properties: {
            user: USER_POOL[Math.floor(Math.random() * USER_POOL.length)],
            url: URLS[Math.floor(Math.random() * URLS.length)],
        },
    };
}

export async function post(body: object, apiUrl = process.env.API_URL ?? 'http://localhost:8080'): Promise<void> {
    const res = await fetch(`${apiUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}
