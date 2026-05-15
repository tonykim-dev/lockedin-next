"use client";

import { useTransition } from "react";
import { toggleHabit } from "@/app/actions";

export function ToggleButton({
  habitId,
  doneToday,
}: {
  habitId: number;
  doneToday: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={doneToday}
      disabled={pending}
      onChange={() => startTransition(() => toggleHabit(habitId))}
    />
  );
}
