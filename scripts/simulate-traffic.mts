// scripts/simulate-traffic.ts
import { generateEvent, post } from './event-helpers.mts';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

async function simulate(targetRps: number, concurrency: number) {
    console.log(`Simulating ~${targetRps} events/s (concurrency=${concurrency}). Ctrl+C to stop.`);

    let running = true;
    let total = 0;
    let currentRate = targetRps;

    process.on("SIGINT", () => { running = false; });
    process.on("SIGTERM", () => { running = false; });

    // Vary rate +-40% every ~5s to simulate natural traffic spikes
    const rateInterval = setInterval(() => {
        currentRate = targetRps * (0.6 + Math.random() * 0.8);
    }, 5_000);

    while (running) {
        const batchStart = Date.now();

        const results = await Promise.allSettled(
            Array.from({ length: concurrency }, () => post(generateEvent(new Date().toISOString())))
        );

        const succeeded = results.filter(r => r.status === "fulfilled").length;
        const errors = results.filter(r => r.status === "rejected").length;
        total += succeeded;

        if (errors) console.warn(`${errors} failed in last batch`);
        if (total % 100 === 0 && total > 0) {
            console.log(`Sent ${total} events (rate ~${currentRate.toFixed(1)}/s)`);
        }

        // Throttle to approximate currentRate
        const elapsed = Date.now() - batchStart;
        const targetMs = (concurrency / currentRate) * 1000;
        await sleep(Math.max(0, targetMs - elapsed));
    }

    clearInterval(rateInterval);
    console.log(`
Stopped. Total events sent: ${total}`);
}

const [, , rps = "5", concurrency = "3"] = process.argv;
simulate(Number(rps), Number(concurrency)).catch(err => {
    console.error(err);
    process.exit(1);
});
