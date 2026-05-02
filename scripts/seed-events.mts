// scripts/seed-events.ts
import { generateEvent, post } from './event-helpers.mts';

function generateRandomDateBetween(from: Date, to: Date): string {
    const ms = from.getTime() + Math.random() * (to.getTime() - from.getTime());
    return new Date(ms).toISOString();
}

function generateRandomTimeAt(date: Date): string {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const ms = startOfDay.getTime() + Math.random() * 1000 * 60 * 60 * 24;
    return new Date(ms).toISOString();
}

async function seed(quantity: number, from: Date, to?: Date) {
    for (let i = 0; i < quantity; i++) {
        try {
            const emittedAt = to ? generateRandomDateBetween(from, to) : generateRandomTimeAt(from);
            await post(generateEvent(emittedAt));
            console.log('event created');
        } catch (err) {
            console.error(err);
        }
    }
}

const [, , quantity = '100', from = '2000-01-01', to] = process.argv;

seed(
    Number(quantity),
    new Date(from),
    to ? new Date(to) : undefined,
).catch((err) => {
    console.error(err);
    process.exit(1);
});