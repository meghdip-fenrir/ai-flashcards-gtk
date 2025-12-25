import { atom } from "jotai";
import type { Flashcard, Rating } from "./types";

const initialCards: Flashcard[] = [
    { id: 1, front: "What is the capital of France?", back: "Paris", ease: 2.5, reviews: 0 },
    { id: 2, front: "What is 2 + 2?", back: "4", ease: 2.5, reviews: 0 },
    { id: 3, front: "What programming language is React written in?", back: "JavaScript", ease: 2.5, reviews: 0 },
    { id: 4, front: "What year did World War II end?", back: "1945", ease: 2.5, reviews: 0 },
    { id: 5, front: "What is the chemical symbol for water?", back: "H2O", ease: 2.5, reviews: 0 },
    { id: 6, front: "Who painted the Mona Lisa?", back: "Leonardo da Vinci", ease: 2.5, reviews: 0 },
    { id: 7, front: "What is the largest planet in our solar system?", back: "Jupiter", ease: 2.5, reviews: 0 },
    { id: 8, front: "What is the square root of 144?", back: "12", ease: 2.5, reviews: 0 },
];

// Base atoms
export const cardsAtom = atom<Flashcard[]>(initialCards);
export const currentIndexAtom = atom(0);
export const isFlippedAtom = atom(false);
export const reviewedCountAtom = atom(0);

// Derived atoms
export const currentCardAtom = atom((get) => {
    const cards = get(cardsAtom);
    const index = get(currentIndexAtom);
    return cards[index];
});

export const totalCardsAtom = atom((get) => get(cardsAtom).length);

// Action atoms
export const flipCardAtom = atom(null, (get, set) => {
    set(isFlippedAtom, !get(isFlippedAtom));
});

export const nextCardAtom = atom(null, (get, set) => {
    const currentIndex = get(currentIndexAtom);
    const totalCards = get(totalCardsAtom);
    if (currentIndex < totalCards - 1) {
        set(currentIndexAtom, currentIndex + 1);
        set(isFlippedAtom, false);
    }
});

export const prevCardAtom = atom(null, (get, set) => {
    const currentIndex = get(currentIndexAtom);
    if (currentIndex > 0) {
        set(currentIndexAtom, currentIndex - 1);
        set(isFlippedAtom, false);
    }
});

const easeModifiers: Record<Rating, number> = {
    again: -0.2,
    hard: -0.15,
    good: 0,
    easy: 0.15,
};

export const rateCardAtom = atom(null, (get, set, rating: Rating) => {
    const currentIndex = get(currentIndexAtom);
    const totalCards = get(totalCardsAtom);

    set(cardsAtom, (prevCards) =>
        prevCards.map((card, idx) =>
            idx === currentIndex
                ? {
                      ...card,
                      ease: Math.max(1.3, card.ease + easeModifiers[rating]),
                      reviews: card.reviews + 1,
                  }
                : card
        )
    );

    set(reviewedCountAtom, (c) => c + 1);

    if (currentIndex < totalCards - 1) {
        set(currentIndexAtom, currentIndex + 1);
    } else {
        set(currentIndexAtom, 0);
    }
    set(isFlippedAtom, false);
});
