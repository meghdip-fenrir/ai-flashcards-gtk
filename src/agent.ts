import { chat } from "@tanstack/ai";
import { anthropicText } from "@tanstack/ai-anthropic";
import { z } from "zod";
import type { Flashcard } from "./types.js";
import { getWeakCards, getNextId } from "./storage.js";

// Schema for generated flashcards with detailed descriptions for better AI output
const FlashcardSchema = z.object({
  front: z
    .string()
    .describe(
      "The question or prompt shown on the front of the flashcard. Should be clear, specific, and test exactly one concept. Avoid yes/no questions - prefer 'what', 'how', 'why' questions that require recall.",
    ),
  back: z
    .string()
    .describe(
      "The answer shown on the back of the flashcard. Should be concise but complete - typically 1-3 sentences. Include the essential information needed to correctly answer the question.",
    ),
});

const FlashcardsResponseSchema = z.object({
  cards: z
    .array(FlashcardSchema)
    .describe(
      "Array of flashcards to generate. Each card should cover a distinct concept. Order from fundamental to more advanced concepts.",
    ),
  reasoning: z
    .string()
    .describe(
      "Brief explanation (1-2 sentences) of the pedagogical approach taken - why these specific cards were chosen and how they help the learner.",
    ),
});

export type GeneratedFlashcards = z.infer<typeof FlashcardsResponseSchema>;

// Create the Anthropic adapter
function getAdapter() {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is required. " +
        "Please set it before running the application.",
    );
  }
  return anthropicText("claude-sonnet-4-5", { apiKey });
}

interface GenerateCardsOptions {
  existingCards?: Flashcard[];
  topic?: string;
  count?: number;
}

export async function generateFlashcards(
  options: GenerateCardsOptions,
): Promise<Flashcard[]> {
  const { existingCards = [], topic, count = 5 } = options;

  let systemPrompt: string;
  let userPrompt: string;

  if (existingCards.length > 0 && !topic) {
    // Generate cards based on weak areas
    const weakCards = getWeakCards(existingCards);

    if (weakCards.length === 0) {
      // No weak cards yet, generate varied cards based on existing topics
      const topics = existingCards.map((c) => c.front).join("\n");
      systemPrompt = `You are an expert educational content creator specializing in spaced repetition learning.
Your task is to create high-quality flashcards that are clear, concise, and effective for learning.

Guidelines:
- Each question should test one specific concept
- Answers should be brief but complete
- Avoid ambiguous or trick questions
- Cover related concepts to reinforce learning`;

      userPrompt = `The user is learning with these flashcards:
${topics}

Create ${count} new flashcards that explore related topics or go deeper into these subjects.`;
    } else {
      // Focus on weak areas
      const weakCardInfo = weakCards
        .map(
          (c) =>
            `- "${c.front}" → "${c.back}" (ease: ${c.ease.toFixed(2)}, reviews: ${c.reviews})`,
        )
        .join("\n");

      systemPrompt = `You are an expert educational content creator specializing in spaced repetition learning.
Your task is to help users strengthen their weak areas by creating targeted flashcards.

Guidelines:
- Analyze the difficult cards to understand what concepts the user struggles with
- Create cards that approach these concepts from different angles
- Break down complex topics into simpler sub-concepts
- Provide related practice questions that build understanding`;

      userPrompt = `The user is struggling with these flashcards (lower ease = more difficulty):
${weakCardInfo}

Create ${count} new flashcards that will help strengthen understanding of these weak areas.
Focus on:
1. Breaking down the concepts into smaller pieces
2. Providing different perspectives on the same material
3. Creating bridge cards that connect to easier concepts`;
    }
  } else if (topic) {
    // Generate fresh cards on a new topic
    systemPrompt = `You are an expert educational content creator specializing in spaced repetition learning.
Your task is to create a comprehensive set of beginner-friendly flashcards on a given topic.

Guidelines:
- Start with fundamental concepts and build up
- Each question should test one specific concept
- Answers should be brief but complete
- Cover the most important aspects of the topic
- Avoid overly obscure or advanced material for initial cards`;

    userPrompt = `Create ${count} flashcards about: ${topic}

Start with the fundamentals and include a mix of:
- Basic definitions and concepts
- Key facts and figures
- Important relationships and connections`;
  } else {
    throw new Error("Either existingCards or topic must be provided");
  }

  try {
    // Use TanStack AI structured output - response is automatically parsed and validated
    const response = await chat({
      adapter: getAdapter(),
      messages: [{ role: "user", content: userPrompt }],
      systemPrompts: [systemPrompt],
      outputSchema: FlashcardsResponseSchema,
    });

    // Response is already typed as GeneratedFlashcards
    const startId = getNextId(existingCards);
    return response.cards.map((card: { front: string; back: string }, index: number) => ({
      id: startId + index,
      front: card.front,
      back: card.back,
      ease: 2.5,
      reviews: 0,
    }));
  } catch (error) {
    console.error("Failed to generate flashcards:", error);
    throw error;
  }
}

// Convenience function for generating cards from a topic
export async function generateFromTopic(
  topic: string,
  count: number = 5,
): Promise<Flashcard[]> {
  return generateFlashcards({ topic, count });
}

// Convenience function for generating cards based on weak areas
export async function generateFromWeakAreas(
  existingCards: Flashcard[],
  count: number = 5,
): Promise<Flashcard[]> {
  return generateFlashcards({ existingCards, count });
}
