"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { AtomFormFields } from "../types/atom.type";
export async function createAtom(AtomData: AtomFormFields) {
  try {
    const { title } = AtomData;
    const supabase = await createClientForServer();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      return { sucess: false, error: "User not found" };
    }

    const { data, error } = await supabase
      .from("atoms")
      .insert({ title, user_id: user.data.user.id });

    if (error) throw error;

    revalidatePath("/");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating atom:", error);
    return { success: false, error: error.message };
  }
}
