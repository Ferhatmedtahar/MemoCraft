"use server";

import { createClientForServer } from "@/utils/supabase/server";

export async function fetchAtoms() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data } = await supabase
    .from("atoms")
    .select("*")
    .eq("user_id", user.data.user.id);
  return data;
}

export async function fetchAtomsByFolder(folderId: string) {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data } = await supabase
    .from("atoms")
    .select("*")
    .eq("user_id", user.data.user.id)
    .eq("folder_id", folderId);
  return data;
}

export async function fetchFolders() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data } = await supabase
    .from("folders")
    .select("*")
    .eq("folder_type", "atoms")
    .eq("user_id", user.data.user.id);
  return data;
}
