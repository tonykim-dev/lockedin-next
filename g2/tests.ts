// tests.ts
// Manual test runner. Run with `bun run tests.ts`.
// Each test prints PASS or FAIL. Eyeball the output.

import type { Completion } from "./types.ts";
import {
    getCurrentStreak,
    getLongestStreak,
    getCompletionRate,
} from "./analytics.ts";

let passed = 0;
let failed = 0;

function assertEq<T>(label: string, actual: T, expected: T): void {
    const ok = actual === expected;
    if (ok) {
        console.log(`  ✓ ${label}`);
        passed += 1;
    } else {
        console.log(`  ✗ ${label} — got ${actual}, expected ${expected}`);
        failed += 1;
    }
}

// Helper to build completions concisely.
function c(id: number, habit_id: number, day: string, skipped = false): Completion {
    return {
        id,
        habit_id,
        day,
        completed_at: `${day}T12:00:00Z`,
        skipped,
        skip_reason: skipped ? "test" : null,
    };
}

const TODAY = "2026-04-06"; // matches your real data's last day

// ---- getCurrentStreak ----
console.log("\ngetCurrentStreak:");

assertEq(
    "empty completions → 0",
    getCurrentStreak(1, [], TODAY),
    0
);

assertEq(
    "today only → 1",
    getCurrentStreak(1, [c(1, 1, "2026-04-06")], TODAY),
    1
);

assertEq(
    "today + yesterday + day before → 3",
    getCurrentStreak(
        1,
        [
            c(1, 1, "2026-04-06"),
            c(2, 1, "2026-04-05"),
            c(3, 1, "2026-04-04"),
        ],
        TODAY
    ),
    3
);

assertEq(
    "today + skipped 2 days ago breaks chain → 1",
    // 04-06 hit, 04-05 missing entirely, 04-04 hit. Chain breaks at 04-05.
    getCurrentStreak(
        1,
        [c(1, 1, "2026-04-06"), c(2, 1, "2026-04-04")],
        TODAY
    ),
    1
);

assertEq(
    "skip on yesterday continues streak (skip = active day)",
    getCurrentStreak(
        1,
        [c(1, 1, "2026-04-06"), c(2, 1, "2026-04-05", true)],
        TODAY
    ),
    2
);

assertEq(
    "completions for other habits ignored",
    getCurrentStreak(
        1,
        [c(1, 1, "2026-04-06"), c(2, 2, "2026-04-05")],
        TODAY
    ),
    1
);

// ---- getLongestStreak ----
console.log("\ngetLongestStreak:");

assertEq("empty → 0", getLongestStreak(1, []), 0);

assertEq(
    "single completion → 1",
    getLongestStreak(1, [c(1, 1, "2026-01-01")]),
    1
);

assertEq(
    "5 consecutive → 5",
    getLongestStreak(1, [
        c(1, 1, "2026-01-01"),
        c(2, 1, "2026-01-02"),
        c(3, 1, "2026-01-03"),
        c(4, 1, "2026-01-04"),
        c(5, 1, "2026-01-05"),
    ]),
    5
);

assertEq(
    "two runs (3 then 4), longest is 4",
    getLongestStreak(1, [
        c(1, 1, "2026-01-01"),
        c(2, 1, "2026-01-02"),
        c(3, 1, "2026-01-03"),
        // gap
        c(4, 1, "2026-01-10"),
        c(5, 1, "2026-01-11"),
        c(6, 1, "2026-01-12"),
        c(7, 1, "2026-01-13"),
    ]),
    4
);

assertEq(
    "duplicates on same day count once",
    getLongestStreak(1, [
        c(1, 1, "2026-01-01"),
        c(2, 1, "2026-01-01"), // duplicate day
        c(3, 1, "2026-01-02"),
    ]),
    2
);

// ---- getCompletionRate ----
console.log("\ngetCompletionRate:");

assertEq(
    "empty over 7 days → 0",
    getCompletionRate(1, [], 7, TODAY),
    0
);

assertEq(
    "perfect 7 → 1",
    getCompletionRate(
        1,
        [
            c(1, 1, "2026-04-06"),
            c(2, 1, "2026-04-05"),
            c(3, 1, "2026-04-04"),
            c(4, 1, "2026-04-03"),
            c(5, 1, "2026-04-02"),
            c(6, 1, "2026-04-01"),
            c(7, 1, "2026-03-31"),
        ],
        7,
        TODAY
    ),
    1
);

assertEq(
    "3 of 7 → ~0.428",
    Math.round(
        getCompletionRate(
            1,
            [
                c(1, 1, "2026-04-06"),
                c(2, 1, "2026-04-04"),
                c(3, 1, "2026-04-02"),
            ],
            7,
            TODAY
        ) * 1000
    ) / 1000,
    Math.round((3 / 7) * 1000) / 1000
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);