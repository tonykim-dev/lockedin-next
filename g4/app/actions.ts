'use server'

import { revalidatePath } from 'next/cache'
import { getHabits, saveHabits } from '@/lib/data'

export async function toggleHabit(habitId: number): Promise<void> {
    const habits = await getHabits()
    const updated = habits.map(h =>
        h.id === habitId ? { ...h, doneToday: !h.doneToday } : h
    )
    await saveHabits(updated)

    // Tell Next.js: "the / route's data changed, re-render it on next render."
    revalidatePath('/')
}