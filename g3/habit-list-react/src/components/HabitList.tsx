import { HabitCard } from "./HabitCard";
import type { Habit, Completion } from "../types";

interface Props {
  habits: Habit[];
  completions: Completion[];
  today: string;
  onToggle: (id: number) => void;
}

export function HabitList({ habits, completions, today, onToggle }: Props) {
  return (
    <ul>
      {habits.map((h) => {
        const done = completions.some(
          (c) => c.habitId === h.id && c.day === today && c.completed,
        );
        return (
          <HabitCard
            key={h.id} // stable id, NEVER array index
            habit={h}
            done={done}
            onToggle={() => onToggle(h.id)}
          />
        );
      })}
    </ul>
  );
}
