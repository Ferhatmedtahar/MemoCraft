"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFolder(folderData: {
  title: string;
  color: string;
}) {
  try {
    const { title, color } = folderData;
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { success: false, error: "User not found" };
    }

    const { data, error } = await supabase.from("folders").insert({
      name: title,
      color,
      user_id: user.data.user.id,
    });

    if (error) throw error;

    revalidatePath("/");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating folder:", error);
    return { success: false, error: error.message };
  }
}
