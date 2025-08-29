"use server";

import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateDeckParams {
  deck_name: string;
  color: string;
}

export async function createDeck(params: CreateDeckParams) {
  try {
    const supabase = await createClientForServer();

    // Get the current user
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

    // Insert the new deck with empty content array
    const { data, error } = await supabase
      .from("flashcards")
      .insert({
        user_id: user.id,
        deck_name: params.deck_name,
        color: params.color,
        content: [], // Start with empty array
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

    // Revalidate the flashcards page
    revalidatePath("/flashcards");

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
