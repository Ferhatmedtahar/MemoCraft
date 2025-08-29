"use server";

import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDeck(
  deckId: string,
  deck_name: string,
  description: string,
  color: string
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
        error: "You must be logged in to update a deck",
      };
    }

    const { data, error } = await supabase
      .from("flashcards")
      .update({
        deck_name: deck_name,
        description: description,
        color: color,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating deck:", error);
      return {
        success: false,
        error: "Failed to update deck. Please try again.",
      };
    }

    revalidatePath("/dashboard/decks");
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error updating deck:", error);
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
        error: "You must be logged in to delete a deck",
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
