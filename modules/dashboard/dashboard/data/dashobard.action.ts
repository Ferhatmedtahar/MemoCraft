"use server";

import { createClientForServer } from "@/utils/supabase/server";
import { fetchAtoms } from "../../atoms/data/fetchData";
import { fetchDecks } from "../../decks/features/data/fetchData";
import { fetchNotes } from "../../notes/data/fetchData";

export async function fetchDashboardData() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch notes, atoms, and flashcards
  const [notes, atoms, { data: flashcards }] = await Promise.all([
    fetchNotes(),
    fetchAtoms(),
    fetchDecks(),
  ]);

  return {
    user,
    notes: notes || [],
    atoms: atoms || [],
    flashcards: flashcards || [],
  };
}
