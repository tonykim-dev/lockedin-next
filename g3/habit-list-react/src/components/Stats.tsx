import type { Habit, Completion } from "../types";

export function Stats({
  habits,
  completions,
  today,
}: {
  habits: Habit[];
  completions: Completion[];
  today: string;
}) {
  const completedToday = completions.filter(
    (c) => c.day === today && c.completed,
  ).length;
  return (
    <p>
      {completedToday} / {habits.length} completed today
    </p>
  );
}
