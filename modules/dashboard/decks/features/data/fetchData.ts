"use server";

import { createClientForServer } from "@/utils/supabase/server";

export async function fetchDecks() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return { success: false, message: "User not found" };

  const { data } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", user.data.user.id);
  return { success: true, data };
}

export async function fetchDeckById(id: string) {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return { success: false, message: "User not found" };

  const { data } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", user.data.user.id)
    .eq("id", id);
  return { success: true, data };
}
