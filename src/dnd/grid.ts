import { type } from "os"

export interface Card {
    id: string
    content: string
    row: number
    column: number
}

export function instanceOfCard(object: any): boolean {
    return (
        "id" in object &&
        "content" in object &&
        "row" in object &&
        "column" in object
    )
}

export interface Stack extends Card {
    cards: Card[]
}

export function instanceOfStack(object: any): boolean {
    return (
        "id" in object &&
        "content" in object &&
        "row" in object &&
        "column" in object &&
        "cards" in object
    )
}

export type Column = (Card | Stack)[]

export type Grid = Column[]

const col_1 = [
    { id: "c_0", content: "0", row: 0, column: 0 },
    { id: "c_3", content: "3", row: 0, column: 0 },
    {
        id: "stack_0",
        content: "stack 0",
        row: 0,
        column: 0,
        cards: [
            { id: "c_4", content: "4", row: 0, column: 0 },
            { id: "c_5", content: "5", row: 0, column: 0 },
        ],
    },
]

const col_2 = [{ id: "c_1", content: "1", row: 0, column: 0 }]

const col_3 = [{ id: "c_2", content: "2", row: 0, column: 0 }]

export default [col_1, col_2, col_3] as Grid
