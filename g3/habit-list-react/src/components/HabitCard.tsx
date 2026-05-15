import type { Habit } from "../types";

interface Props {
  habit: Habit;
  done: boolean;
  onToggle: () => void;
}

export function HabitCard({ habit, done, onToggle }: Props) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={done} onChange={onToggle} />
        {habit.name}
      </label>
    </li>
  );
}
