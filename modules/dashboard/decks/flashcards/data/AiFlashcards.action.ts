"use server";

import { checkAndUpdateAIUsage } from "@/lib/ai-usage";
import { callGemini } from "@/lib/gemini";

interface FlashcardData {
  question: string;
  answer: string;
  hint: string;
}

export async function generateFlashcardsWithAI(
  noteContent: string,
  numberOfCards: number
): Promise<{ success: boolean; flashcards: FlashcardData[]; error?: string }> {
  if (!noteContent.trim()) {
    return { success: false, flashcards: [], error: "Note content is empty" };
  }

  if (numberOfCards < 1 || numberOfCards > 20) {
    return {
      success: false,
      flashcards: [],
      error: "Number of cards must be between 1 and 20",
    };
  }

  const usageCheck = await checkAndUpdateAIUsage();
  if (!usageCheck.success || !usageCheck.canUseAI) {
    return {
      success: false,
      flashcards: [],
      error: usageCheck.message,
    };
  }

  const prompt = `Generate exactly ${numberOfCards} flashcards from the following content. 

IMPORTANT RULES:
- Create EXACTLY ${numberOfCards} flashcards, no more, no less
- Each flashcard should test understanding of key concepts from the content
- Questions should be clear and specific
- Answers should be concise but complete
- Hints should be 1-2 characters from the answer followed by "..." (e.g., "Pa..." for "Paris")
- For numeric answers, the hint should be the full number
- Return ONLY a valid JSON array with no additional text or formatting
- Each flashcard must have: question, answer, hint

Content to generate flashcards from:
${noteContent}

Return format (JSON array only):
[
  {
    "question": "What is the capital of France?",
    "answer": "Paris",
    "hint": "Pa..."
  }
]`;

  try {
    const aiResponse = await callGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 2048,
      topK: 40,
    });

    let flashcards: FlashcardData[] = [];
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }

      flashcards = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(flashcards)) {
        throw new Error("Response is not an array");
      }

      flashcards = flashcards
        .filter(
          (card) =>
            card &&
            typeof card.question === "string" &&
            typeof card.answer === "string" &&
            typeof card.hint === "string" &&
            card.question.trim() &&
            card.answer.trim()
        )
        .map((card) => ({
          question: card.question.trim(),
          answer: card.answer.trim(),
          hint: card.hint.trim() || generateHint(card.answer.trim()),
        }));

      if (flashcards.length === 0) {
        throw new Error("No valid flashcards generated");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("AI Response:", aiResponse);
      return {
        success: false,
        flashcards: [],
        error: "Failed to parse AI response",
      };
    }

    return { success: true, flashcards };
  } catch (error) {
    console.error("Error in generateFlashcardsWithAI:", error);
    return {
      success: false,
      flashcards: [],
      error: "An unexpected error occurred",
    };
  }
}

function generateHint(answer: string): string {
  if (!answer) return "";

  if (/^\d+$/.test(answer.trim())) {
    return answer;
  }

  const trimmed = answer.trim();
  if (trimmed.length <= 2) return trimmed;
  return trimmed.substring(0, 2) + "...";
}
