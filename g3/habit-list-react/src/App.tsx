import { useEffect, useState } from "react";
import { HabitList } from "./components/HabitList";
import { Stats } from "./components/Stats";
import type { Habit, Completion } from "./types";

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  // Empty deps = run once after mount.
  useEffect(() => {
    fetch("/habits")
      .then((r) => r.json())
      .then((data: Habit[]) => setHabits(data));
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const toggle = (habitId: number) => {
    const existing = completions.find(
      (c) => c.habitId === habitId && c.day === today,
    );
    if (existing) {
      setCompletions(
        completions.map((c) =>
          c.habitId === habitId && c.day === today
            ? { ...c, completed: !c.completed } // new object
            : c,
        ),
      );
    } else {
      setCompletions([
        ...completions,
        { habitId, day: today, completed: true },
      ]);
    }
  };

  return (
    <>
      <Stats habits={habits} completions={completions} today={today} />
      <HabitList
        habits={habits}
        completions={completions}
        today={today}
        onToggle={toggle}
      />
    </>
  );
}
