import { getHabits } from "@/lib/data";
import { HabitList } from "@/app/components/HabitList";

export default async function HomePage() {
  const habits = await getHabits();
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">LockedIn</h1>
      <HabitList habits={habits} />
    </main>
  );
}
