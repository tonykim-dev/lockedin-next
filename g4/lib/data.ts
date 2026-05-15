import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Habit } from '@/types'

const DB_PATH = path.join(process.cwd(), 'data', 'habits.json')

export async function getHabits(): Promise<Habit[]> {
    const raw = await readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw) as Habit[]
}

export async function getHabit(id: number): Promise<Habit | null> {
    const habits = await getHabits()
    return habits.find(h => h.id === id) ?? null
}

export async function saveHabits(habits: Habit[]): Promise<void> {
    await writeFile(DB_PATH, JSON.stringify(habits, null, 2))
}