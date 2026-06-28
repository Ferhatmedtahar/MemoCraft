"use server";
import { createClientForServer } from "@/utils/supabase/server";

export async function fetchNotes() {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return null;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchNotes:", error);
    return null;
  }
}

export async function fetchFolders() {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("folder_type", "notes")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching folders:", error);
      return { success: false, message: "Failed to fetch folders" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in fetchFolders:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function fetchNoteById(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (error) {
      console.error("Error fetching note:", error);
      return { success: false, message: "Note not found" };
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error in fetchNoteById:", error);
    return { success: false, message: "An error occurred" };
  }
}
