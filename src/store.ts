import { atom } from "jotai";
import type { Flashcard, Rating } from "./types.js";
import { loadFlashcards, saveFlashcards, type FlashcardData } from "./storage.js";
import { generateFlashcards } from "./agent.js";

// Load initial data from storage or use empty array
const storedData = loadFlashcards();
const initialCards: Flashcard[] = storedData?.cards ?? [];
const initialTopic: string | undefined = storedData?.topic;

// Base atoms
export const cardsAtom = atom<Flashcard[]>(initialCards);
export const topicAtom = atom<string | undefined>(initialTopic);
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
export const hasCardsAtom = atom((get) => get(cardsAtom).length > 0);

// AI generation state atoms
export const isGeneratingAtom = atom(false);
export const generationErrorAtom = atom<string | null>(null);

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

// Helper to persist cards
function persistCards(cards: Flashcard[], topic?: string): void {
    saveFlashcards({
        cards,
        topic,
        lastUpdated: new Date().toISOString(),
    });
}

export const rateCardAtom = atom(null, (get, set, rating: Rating) => {
    const currentIndex = get(currentIndexAtom);
    const totalCards = get(totalCardsAtom);
    const topic = get(topicAtom);

    const updatedCards = get(cardsAtom).map((card, idx) =>
        idx === currentIndex
            ? {
                  ...card,
                  ease: Math.max(1.3, card.ease + easeModifiers[rating]),
                  reviews: card.reviews + 1,
              }
            : card
    );

    set(cardsAtom, updatedCards);
    persistCards(updatedCards, topic);

    set(reviewedCountAtom, (c) => c + 1);

    if (currentIndex < totalCards - 1) {
        set(currentIndexAtom, currentIndex + 1);
    } else {
        set(currentIndexAtom, 0);
    }
    set(isFlippedAtom, false);
});

// AI generation action atoms
export const generateFromTopicAtom = atom(
    null,
    async (get, set, topic: string, count: number = 5) => {
        set(isGeneratingAtom, true);
        set(generationErrorAtom, null);

        try {
            const newCards = await generateFlashcards({ topic, count });
            set(cardsAtom, newCards);
            set(topicAtom, topic);
            set(currentIndexAtom, 0);
            set(isFlippedAtom, false);
            set(reviewedCountAtom, 0);
            persistCards(newCards, topic);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to generate cards";
            set(generationErrorAtom, message);
            throw error;
        } finally {
            set(isGeneratingAtom, false);
        }
    }
);

export const generateMoreCardsAtom = atom(
    null,
    async (get, set, count: number = 5) => {
        const existingCards = get(cardsAtom);
        const topic = get(topicAtom);

        if (existingCards.length === 0) {
            throw new Error("No existing cards to base generation on");
        }

        set(isGeneratingAtom, true);
        set(generationErrorAtom, null);

        try {
            const newCards = await generateFlashcards({
                existingCards,
                count,
            });
            const allCards = [...existingCards, ...newCards];
            set(cardsAtom, allCards);
            persistCards(allCards, topic);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to generate cards";
            set(generationErrorAtom, message);
            throw error;
        } finally {
            set(isGeneratingAtom, false);
        }
    }
);

// Clear all cards and start fresh
export const clearCardsAtom = atom(null, (get, set) => {
    set(cardsAtom, []);
    set(topicAtom, undefined);
    set(currentIndexAtom, 0);
    set(isFlippedAtom, false);
    set(reviewedCountAtom, 0);
    persistCards([], undefined);
});
