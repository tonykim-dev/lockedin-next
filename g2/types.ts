// types.ts
// Mirrors the SQLite schema in lockedin/data.db.
// VERIFY THESE against `sqlite3 lockedin/data.db ".schema habits"` etc.

export interface Habit {
    id: number;
    name: string;
    created_at: string;       // ISO timestamp, e.g. "2025-12-05T14:23:00"
    archived_at: string | null;
}

export interface Completion {
    id: number;
    habit_id: number;
    day: string;              // "YYYY-MM-DD" — the local-day this completion belongs to
    completed_at: string;     // ISO timestamp of when it was actually marked
    skipped: boolean;         // true = "I'm skipping today on purpose, don't break my streak"
    skip_reason: string | null;
}

export interface WardrobeItem {
    id: number;
    name: string;
    category: string;
    last_worn: string | null; // "YYYY-MM-DD"
}