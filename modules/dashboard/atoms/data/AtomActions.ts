"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteAtom(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("atoms")
      .delete()
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting atom:", error);
    throw new Error("Failed to delete atom");
  }
}

export async function updateAtom(id: string, title: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("atoms")
      .update({ title })
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating atom:", error);
    throw new Error("Failed to update atom");
  }
}

export async function togglePin(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    // First get the current pin status
    const { data: currentAtom, error: fetchError } = await supabase
      .from("atoms")
      .select("pinned")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the pin status
    const { error } = await supabase
      .from("atoms")
      .update({ pinned: !currentAtom.pinned })
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

export async function toggleFavorite(id: string) {
  try {
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    // First get the current favorite status
    const { data: currentAtom, error: fetchError } = await supabase
      .from("atoms")
      .select("favorite")
      .eq("id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the favorite status
    const { error } = await supabase
      .from("atoms")
      .update({ favorite: !currentAtom.favorite })
      .eq("id", id)
      .eq("user_id", user.data.user.id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Failed to toggle favorite");
  }
}
