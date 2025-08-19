"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { AtomFormFields } from "../types/atom.type";

export async function createAtom(AtomData: AtomFormFields) {
  const { title } = AtomData;

  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return;

  const { data, error } = await supabase
    .from("atoms")
    .insert({ title, user_id: user.data.user.id });
  if (error) console.log(error);

  return data;
}
