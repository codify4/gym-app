
export interface Suggestion {
    id: string
    text: string
    delay: number
}

export const suggestions: Suggestion[] = [
    { id: "1", text: "Keep your elbows closer", delay: 0 },
    { id: "2", text: "Arch your back", delay: 200 },
]