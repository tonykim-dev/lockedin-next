// server.ts
// Port of Day 1's server.js to TypeScript. Adds /habits/:id/streak.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import type { Habit, Completion } from "./types.ts";
import {
    getCurrentStreak,
    getLongestStreak,
    getCompletionRate,
} from "./analytics.ts";

const PORT = 3000;
const HABITS_FILE = "./habits.json";
const COMPLETIONS_FILE = "./completions.json";

// ---- Persistence ----

async function loadHabits(): Promise<Habit[]> {
    try {
        const raw = await readFile(HABITS_FILE, "utf-8");
        return JSON.parse(raw) as Habit[];
    } catch {
        return [];
    }
}

async function saveHabits(habits: Habit[]): Promise<void> {
    await writeFile(HABITS_FILE, JSON.stringify(habits, null, 2), "utf-8");
}

async function loadCompletions(): Promise<Completion[]> {
    try {
        const raw = await readFile(COMPLETIONS_FILE, "utf-8");
        return JSON.parse(raw) as Completion[];
    } catch {
        return [];
    }
}

async function saveCompletions(completions: Completion[]): Promise<void> {
    await writeFile(COMPLETIONS_FILE, JSON.stringify(completions, null, 2), "utf-8");
}

// ---- Body parsing with `unknown` ----

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf-8");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Narrow `unknown` to `{ name: string }` — this is where `unknown` earns its keep.
function isCreateHabitBody(body: unknown): body is { name: string } {
    return (
        typeof body === "object" &&
        body !== null &&
        "name" in body &&
        typeof (body as { name: unknown }).name === "string"
    );
}

// ---- Response helpers ----

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function sendStatus(res: ServerResponse, status: number): void {
    res.writeHead(status);
    res.end();
}

// ---- Helpers ----

function todayString(): string {
    return new Date().toISOString().slice(0, 10);
}

// ---- Routing ----

const server = createServer(async (req, res) => {
    const url = req.url ?? "/";
    const method = req.method ?? "GET";

    try {
        // GET /habits
        if (method === "GET" && url === "/habits") {
            const habits = await loadHabits();
            return sendJson(res, 200, habits);
        }

        // POST /habits
        if (method === "POST" && url === "/habits") {
            const body = await readJsonBody(req);
            if (!isCreateHabitBody(body)) {
                return sendJson(res, 400, { error: "name (string) required" });
            }
            const habits = await loadHabits();
            const newHabit: Habit = {
                id: habits.length === 0 ? 1 : Math.max(...habits.map((h) => h.id)) + 1,
                name: body.name,
                created_at: new Date().toISOString(),
                archived_at: null,
            };
            habits.push(newHabit);
            await saveHabits(habits);
            return sendJson(res, 201, newHabit);
        }

        // POST /habits/:id/complete
        const completeMatch = url.match(/^\/habits\/(\d+)\/complete$/);
        if (method === "POST" && completeMatch) {
            const id = Number(completeMatch[1]);
            const habits = await loadHabits();
            const habit = habits.find((h) => h.id === id);
            if (!habit) return sendStatus(res, 404);

            const completions = await loadCompletions();
            const today = todayString();
            // Only add if not already completed today.
            if (!completions.some((c) => c.habit_id === id && c.day === today)) {
                const newCompletion: Completion = {
                    id: completions.length === 0 ? 1 : Math.max(...completions.map((c) => c.id)) + 1,
                    habit_id: id,
                    day: today,
                    completed_at: new Date().toISOString(),
                    skipped: false,
                    skip_reason: null,
                };
                completions.push(newCompletion);
                await saveCompletions(completions);
            }
            return sendJson(res, 200, habit);
        }

        // GET /habits/:id/streak  (new for Day 2)
        const streakMatch = url.match(/^\/habits\/(\d+)\/streak$/);
        if (method === "GET" && streakMatch) {
            const id = Number(streakMatch[1]);
            const habits = await loadHabits();
            if (!habits.some((h) => h.id === id)) return sendStatus(res, 404);

            const completions = await loadCompletions();
            const today = todayString();
            return sendJson(res, 200, {
                habit_id: id,
                currentStreak: getCurrentStreak(id, completions, today),
                longestStreak: getLongestStreak(id, completions),
                completionRate7d: getCompletionRate(id, completions, 7, today),
            });
        }

        // DELETE /habits/:id
        const deleteMatch = url.match(/^\/habits\/(\d+)$/);
        if (method === "DELETE" && deleteMatch) {
            const id = Number(deleteMatch[1]);
            const habits = await loadHabits();
            const idx = habits.findIndex((h) => h.id === id);
            if (idx === -1) return sendStatus(res, 404);
            habits.splice(idx, 1);
            await saveHabits(habits);
            return sendStatus(res, 204);
        }

        // Fallthrough
        return sendStatus(res, 404);
    } catch (err) {
        console.error(err);
        return sendJson(res, 500, { error: "internal" });
    }
});

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});