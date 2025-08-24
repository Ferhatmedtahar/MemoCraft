"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteNote(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note");
  }
}

export async function updateNote(id: string, title: string, content?: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const updateData: any = {
      title,
      updated_at: new Date().toISOString(),
    };

    if (content !== undefined) {
      updateData.content = content;
    }

    const { error } = await supabase
      .from("notes")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }
}

export async function togglePinNote(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    // First get the current pin status
    const { data: currentNote, error: fetchError } = await supabase
      .from("notes")
      .select("is_pinned, pinned")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (fetchError) throw fetchError;

    // Use is_pinned if available, fallback to pinned for backward compatibility
    const currentPinStatus =
      currentNote.is_pinned ?? currentNote.pinned ?? false;

    // Toggle the pin status - update both columns for compatibility
    const { error } = await supabase
      .from("notes")
      .update({
        is_pinned: !currentPinStatus,
        pinned: !currentPinStatus, // for backward compatibility
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling pin:", error);
    throw new Error("Failed to toggle pin");
  }
}

export async function updateNoteFolder(noteId: string, folderId: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("notes")
      .update({
        folder_id: folderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .eq("user_id", user.data.user.id);

    if (error) return { success: false, error: "Failed to update note folder" };

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating note folder:", error);
    return { success: false, error: "Failed to update note folder" };
  }
}

export async function toggleFavoriteNote(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    // First get the current favorite status
    const { data: currentNote, error: fetchError } = await supabase
      .from("notes")
      .select("is_favorite, favorite")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (fetchError) return { success: false, error: "Failed to fetch note" };

    // Use is_favorite if available, fallback to favorite for backward compatibility
    const currentFavoriteStatus =
      currentNote.is_favorite ?? currentNote.favorite ?? false;

    // Toggle the favorite status - update both columns for compatibility
    const { error } = await supabase
      .from("notes")
      .update({
        is_favorite: !currentFavoriteStatus,
        favorite: !currentFavoriteStatus, // for backward compatibility
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) return { success: false, error: "Failed to toggle favorite" };

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Failed to toggle favorite");
  }
}

export async function createNote(
  title: string,
  content: string = "",
  folderId?: string
) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const noteData: any = {
      title,
      content,
      user_id: user.data.user.id,
      is_favorite: false,
      is_pinned: false,
    };

    if (folderId) {
      noteData.folder_id = folderId;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert(noteData)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }
}
