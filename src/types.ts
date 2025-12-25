export interface Flashcard {
    id: number;
    front: string;
    back: string;
    ease: number;
    reviews: number;
}

export type Rating = "again" | "hard" | "good" | "easy";
