// scripts/seed-events.ts
const API_URL = process.env.API_URL ?? 'http://localhost:8080';

const EVENT_TYPES = [
    "PAGE_VIEWED",
    "PAGE_EXITED",
    "TAB_SWITCHED",
    "BUTTON_CLICKED",
    "LINK_CLICKED",
    "DROPDOWN_SELECTED",
    "CHECKBOX_TOGGLED",
    "MODAL_OPENED",
    "MODAL_CLOSED",
    "TOOLTIP_HOVERED",
    "ACCORDION_EXPANDED",
    "FORM_STARTED",
    "FORM_SUBMITTED",
    "CHECKOUT_COMPLETED",
    "PURCHASE_COMPLETED",
    "VIDEO_PLAYED",
    "VIDEO_PAUSED",
    "VIDEO_COMPLETED",
    "FILE_DOWNLOADED",
    "USER_SIGNED_UP",
    "USER_LOGGED_IN",
    "USER_LOGGED_OUT",
    "PASSWORD_RESET_REQUESTED",
    "ERROR_SHOWN",
    "API_ERROR_OCCURRED"
]

const URLS = [
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
]

async function post(body: object) {
    const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        console.error(JSON.stringify(body))
        throw new Error(`Failed: ${res.status} ${await res.text()}`)
    };
}



async function seed(quantity: number, from: Date, to: Date) {
    for (let i = 0; i < quantity; i++) {
        try {
            await post(generateRandomEvent(from, to));
            console.log("event created");
        } catch (err) {
            console.error(err)
        }
    }
}

function generateRandomEvent(from: Date, to: Date) {
    return {
        type: EVENT_TYPES[generateRandomNumber(EVENT_TYPES.length - 1)],
        emittedAt: generateRandomDateBetween(from, to),
        properties: { user: generateRandomId(), url: URLS[generateRandomNumber(URLS.length - 1)] },
    }
}


function generateRandomDateBetween(from: Date, to: Date) {
    const ms = from.getTime() + Math.random() * (to.getTime() - from.getTime());
    return new Date(ms).toISOString();
}
function generateRandomNumber(max: number) {
    return Math.round(Math.random() * max);
}

function generateRandomId(): string {
    return crypto.randomUUID();
}

// at the bottom of the file, replacing the current seed() call
const [, , quantity = '100', from = '2026-04-13', to = '2026-04-20'] = process.argv;

seed(
    Number(quantity),
    new Date(from),
    new Date(to),
).catch((err) => {
    console.error(err);
    process.exit(1);
});