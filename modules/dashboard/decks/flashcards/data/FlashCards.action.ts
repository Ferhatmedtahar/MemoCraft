"use server";

import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateDeckParams {
  deck_name: string;
  color: string;
  description?: string;
}

interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

export async function createDeck(params: CreateDeckParams) {
  try {
    const supabase = await createClientForServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to create a deck",
      };
    }

    const { data, error } = await supabase
      .from("flashcards")
      .insert({
        user_id: user.id,
        deck_name: params.deck_name,
        color: params.color,
        description: params.description || "",
        content: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating deck:", error);
      return {
        success: false,
        error: "Failed to create deck. Please try again.",
      };
    }

    revalidatePath("/dashboard/decks");
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error creating deck:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function addFlashcard(deckId: string, flashcard: Flashcard) {
  try {
    const supabase = await createClientForServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to add flashcards",
      };
    }

    // First, get the current deck
    const { data: currentDeck, error: fetchError } = await supabase
      .from("flashcards")
      .select("content")
      .eq("id", deckId)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      return {
        success: false,
        error: "Failed to fetch deck",
      };
    }

    // Add the new flashcard to the content array
    const updatedContent = [...(currentDeck.content || []), flashcard];

    // Update the deck
    const { data, error } = await supabase
      .from("flashcards")
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error adding flashcard:", error);
      return {
        success: false,
        error: "Failed to add flashcard. Please try again.",
      };
    }

    revalidatePath(`/dashboard/decks/${deckId}`);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error adding flashcard:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateFlashcard(
  deckId: string,
  cardIndex: number,
  updatedCard: Flashcard
) {
  try {
    const supabase = await createClientForServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to update flashcards",
      };
    }

    // Get the current deck
    const { data: currentDeck, error: fetchError } = await supabase
      .from("flashcards")
      .select("content")
      .eq("id", deckId)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      return {
        success: false,
        error: "Failed to fetch deck",
      };
    }

    // Update the specific flashcard
    const updatedContent = [...(currentDeck.content || [])];
    updatedContent[cardIndex] = updatedCard;

    // Update the deck
    const { data, error } = await supabase
      .from("flashcards")
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating flashcard:", error);
      return {
        success: false,
        error: "Failed to update flashcard. Please try again.",
      };
    }

    revalidatePath(`/dashboard/decks/${deckId}`);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error updating flashcard:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteFlashcard(deckId: string, cardIndex: number) {
  try {
    const supabase = await createClientForServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to delete flashcards",
      };
    }

    // Get the current deck
    const { data: currentDeck, error: fetchError } = await supabase
      .from("flashcards")
      .select("content")
      .eq("id", deckId)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      return {
        success: false,
        error: "Failed to fetch deck",
      };
    }

    // Remove the flashcard at the specified index
    const updatedContent = (currentDeck.content || []).filter(
      (_: Flashcard, index: number) => index !== cardIndex
    );

    // Update the deck
    const { data, error } = await supabase
      .from("flashcards")
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting flashcard:", error);
      return {
        success: false,
        error: "Failed to delete flashcard. Please try again.",
      };
    }

    revalidatePath(`/dashboard/decks/${deckId}`);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error deleting flashcard:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteDeck(deckId: string) {
  try {
    const supabase = await createClientForServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to delete decks",
      };
    }

    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", deckId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting deck:", error);
      return {
        success: false,
        error: "Failed to delete deck. Please try again.",
      };
    }

    revalidatePath("/dashboard/decks");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error deleting deck:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
