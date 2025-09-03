"use server";

import { createClientForServer } from "@/utils/supabase/server";

export async function createNote({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return { success: false, error: "User not found" };
  }
  console.log("Attempting to create note...");
  console.log("User:", user);
  console.log("Supabase client initialized:", !!supabase);

  console.log("env", process.env.NEXT_PUBLIC_SUPABASE_URL!);

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user.data.user.id })
    .select()
    .single();
  if (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
  return { success: true, data };
}
