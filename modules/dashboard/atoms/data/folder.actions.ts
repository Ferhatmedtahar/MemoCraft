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

    const { data, error } = await supabase
      .from("folders")
      .insert({
        name,
        color,
        user_id: user.data.user.id,
        type: "atoms",
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { success: false, message: "Failed to create folder" };
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
      name,
      updated_at: new Date().toISOString(),
    };

    if (color !== undefined) {
      updateData.color = color;
    }

    const { error } = await supabase
      .from("folders")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating folder:", error);
    return { success: false, message: "Failed to update folder" };
  }
}

export async function deleteFolder(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, message: "User not authenticated" };
    }

    // First, move all atoms in this folder to unassigned (set folder_id to null)
    await supabase
      .from("atoms")
      .update({ folder_id: null })
      .eq("folder_id", id)
      .eq("user_id", user.data.user.id);

    // Then delete the folder
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return { success: false, message: "Failed to delete folder" };
  }
}
