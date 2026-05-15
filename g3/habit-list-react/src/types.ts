export interface Habit { id: number; name: string }
export interface Completion {
    habitId: number
    day: string       // 'YYYY-MM-DD'
    completed: boolean
}