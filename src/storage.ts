import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { Flashcard } from "./types.js";

export interface FlashcardData {
    cards: Flashcard[];
    topic?: string;
    lastUpdated: string;
}

const DATA_DIR = path.join(os.homedir(), ".local", "share", "ai-flashcards");
const DATA_FILE = path.join(DATA_DIR, "flashcards.json");

function ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export function loadFlashcards(): FlashcardData | null {
    try {
        ensureDataDir();
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, "utf-8");
            return JSON.parse(content) as FlashcardData;
        }
    } catch (error) {
        console.error("Failed to load flashcards:", error);
    }
    return null;
}

export function saveFlashcards(data: FlashcardData): void {
    try {
        ensureDataDir();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Failed to save flashcards:", error);
    }
}

export function hasExistingCards(): boolean {
    const data = loadFlashcards();
    return data !== null && data.cards.length > 0;
}

export function getWeakCards(cards: Flashcard[], count: number = 5): Flashcard[] {
    // Sort by ease (lower = harder) and reviews (more reviews = more data)
    // Prioritize cards with low ease and at least 1 review
    return [...cards]
        .filter(card => card.reviews > 0)
        .sort((a, b) => {
            // Primary sort: ease factor (lower = harder)
            const easeDiff = a.ease - b.ease;
            if (Math.abs(easeDiff) > 0.1) return easeDiff;
            // Secondary sort: more reviews = more reliable data
            return b.reviews - a.reviews;
        })
        .slice(0, count);
}

export function getNextId(cards: Flashcard[]): number {
    if (cards.length === 0) return 1;
    return Math.max(...cards.map(c => c.id)) + 1;
}
