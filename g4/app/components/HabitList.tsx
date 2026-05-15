import { ToggleButton } from "./ToggleButton";
import type { Habit } from "@/types";

export function HabitList({ habits }: { habits: Habit[] }) {
  return (
    <ul className="space-y-2">
      {habits.map((h) => (
        <li key={h.id} className="flex items-center gap-3 p-3 rounded border">
          <ToggleButton habitId={h.id} doneToday={h.doneToday} />
          <span className={h.doneToday ? "line-through text-gray-500" : ""}>
            {h.name}
          </span>
          <a href={`/habits/${h.id}`} className="ml-auto text-sm underline">
            details
          </a>
        </li>
      ))}
    </ul>
  );
}
