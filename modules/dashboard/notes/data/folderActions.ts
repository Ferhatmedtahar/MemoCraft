"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFolder(name: string, color: string = "#6366f1") {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    // Ensure all required fields are explicitly set
    const folderData = {
      name: name.trim(),
      color: color,
      user_id: user.data.user.id,
      folder_type: "notes", // Changed from "folder_type" to "type" and value from "notes" to "notes"
    };

    const { data, error } = await supabase
      .from("folders")
      .insert(folderData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Folder created successfully:", data);
    revalidatePath("/dashboard/notes");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating folder:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create folder",
    };
  }
}

export async function updateFolder(id: string, name: string, color?: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    const updateData: any = {
      name: name.trim(),
      updated_at: new Date().toISOString(),
    };

    if (color !== undefined) {
      updateData.color = color;
    }

    const { data, error } = await supabase
      .from("folders")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating folder:", error);
      throw error;
    }

    revalidatePath("/dashboard/notes");
    return { success: true, data };
  } catch (error) {
    console.error("Error updating folder:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update folder",
    };
  }
}

export async function deleteFolder(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    // First, move all notes in this folder to unassigned (set folder_id to null)
    const { error: notesError } = await supabase
      .from("notes")
      .update({
        folder_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("folder_id", id)
      .eq("user_id", user.data.user.id);

    if (notesError) {
      console.error("Error updating notes:", notesError);
      throw notesError;
    }

    // Then delete the folder
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }

    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete folder",
    };
  }
}

export async function getUserFolders() {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.data.user.id)
      .eq("type", "notes") // Changed from "folder_type" to "type"
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error getting user folders:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get folders",
    };
  }
}
