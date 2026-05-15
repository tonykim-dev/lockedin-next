// analytics.ts
// Pure functions. No `new Date()` inside the streak logic — `today` is injected
// so tests are deterministic.
//
// DESIGN DECISION: A "skipped" completion CONTINUES a streak.
// Rationale: matches the UX of typical habit trackers ("life happens").
// If you want strict streaks, change the filter in walkBack().

import type { Completion } from "./types.ts";

// ---- Helpers ----

/**
 * Shift a YYYY-MM-DD date string by N days (negative = backward).
 * Uses UTC methods to avoid local-timezone drift.
 */
export function dayOffset(dateStr: string, days: number): string {
    // Append T00:00:00Z to force UTC parsing.
    const d = new Date(`${dateStr}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/**
 * Given completions, return a Set of YYYY-MM-DD days where this habit was
 * either completed OR explicitly skipped. (Both keep the streak alive.)
 */
function activeDays(habitId: number, completions: Completion[]): Set<string> {
    const days = new Set<string>();
    for (const c of completions) {
        if (c.habit_id === habitId) {
            days.add(c.day);
        }
    }
    return days;
}

// ---- Public API ----

/**
 * Current streak = number of consecutive days, ending at `today`, where the
 * habit has a completion (or skip). If `today` has no entry, streak is 0.
 */
export function getCurrentStreak(
    habitId: number,
    completions: Completion[],
    today: string
): number {
    const days = activeDays(habitId, completions);
    let streak = 0;
    let cursor = today;
    while (days.has(cursor)) {
        streak += 1;
        cursor = dayOffset(cursor, -1);
    }
    return streak;
}

/**
 * Longest streak = longest consecutive run of days across all history.
 */
export function getLongestStreak(
    habitId: number,
    completions: Completion[]
): number {
    const days = [...activeDays(habitId, completions)].sort(); // lex sort = chrono sort
    if (days.length === 0) return 0;

    let longest = 1;
    let current = 1;
    for (let i = 1; i < days.length; i++) {
        const prev = days[i - 1]!;        // safe: i >= 1
        const curr = days[i]!;
        if (dayOffset(prev, 1) === curr) {
            current += 1;
            if (current > longest) longest = current;
        } else {
            current = 1;
        }
    }
    return longest;
}

/**
 * Completion rate over the last `days` days, ending at `today`.
 * Returns a number 0..1. (Skips count as completions — same rule as streak.)
 */
export function getCompletionRate(
    habitId: number,
    completions: Completion[],
    days: number,
    today: string
): number {
    if (days <= 0) return 0;
    const active = activeDays(habitId, completions);
    let hit = 0;
    let cursor = today;
    for (let i = 0; i < days; i++) {
        if (active.has(cursor)) hit += 1;
        cursor = dayOffset(cursor, -1);
    }
    return hit / days;
}