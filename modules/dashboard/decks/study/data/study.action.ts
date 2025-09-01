"use server";

import { createClientForServer } from "@/utils/supabase/server";

export async function updateDeckStudyResults(
  deckId: string,
  correctAnswers: number,
  totalCards: number
) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    // Update the deck with last_correct_answers field
    const { data, error } = await supabase
      .from("flashcards")
      .update({
        last_correct_answers: correctAnswers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId)
      .eq("user_id", user.data.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating deck:", error);
      return { success: false, message: "Failed to save study results" };
    }

    return {
      success: true,
      message: `Study session completed! You got ${correctAnswers}/${totalCards} correct.`,
      data,
    };
  } catch (error) {
    console.error("Error in updateDeckStudyResults:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function fetchDeckById(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not found" };
    }

    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", user.data.user.id)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching deck:", error);
      return { success: false, message: "Deck not found" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in fetchDeckById:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
