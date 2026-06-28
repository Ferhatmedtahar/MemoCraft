"use server";

import { createClientForServer } from "@/utils/supabase/server";

export interface ActivityData {
  totalActiveDays: number;
  dailyActivity: { date: string; count: number }[];
}

export async function getActivityData(): Promise<ActivityData> {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return {
      totalActiveDays: 0,
      dailyActivity: [],
    };
  }

  const userId = user.data.user.id;

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  try {
    const [{ data: notesData }, { data: atomsData }, { data: flashcardsData }] =
      await Promise.all([
        supabase
          .from("notes")
          .select("created_at, updated_at")
          .eq("user_id", userId)
          .gte("created_at", oneYearAgo.toISOString()),
        supabase
          .from("atoms")
          .select("created_at, updated_at")
          .eq("user_id", userId)
          .gte("created_at", oneYearAgo.toISOString()),
        supabase
          .from("flashcards")
          .select("created_at, updated_at")
          .eq("user_id", userId)
          .gte("created_at", oneYearAgo.toISOString()),
      ]);

    const dailyActivityMap = new Map<string, number>();

    const addActivity = (dateString: string) => {
      if (!dateString) return;
      const date = new Date(dateString).toISOString().split("T")[0];
      dailyActivityMap.set(date, (dailyActivityMap.get(date) || 0) + 1);
    };

    notesData?.forEach((note) => {
      addActivity(note.created_at);
      // Count updates as separate activities if different from creation
      if (note.updated_at && note.updated_at !== note.created_at) {
        addActivity(note.updated_at);
      }
    });

    atomsData?.forEach((atom) => {
      addActivity(atom.created_at);
      // Count updates as separate activities if different from creation
      if (atom.updated_at && atom.updated_at !== atom.created_at) {
        addActivity(atom.updated_at);
      }
    });

    flashcardsData?.forEach((flashcard) => {
      addActivity(flashcard.created_at);
      if (
        flashcard.updated_at &&
        flashcard.updated_at !== flashcard.created_at
      ) {
        addActivity(flashcard.updated_at);
      }
    });

    const dailyActivity = [];
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = dailyActivityMap.get(dateStr) || 0;

      dailyActivity.push({
        date: dateStr,
        count: count,
      });
    }

    const totalActiveDays = Array.from(dailyActivityMap.values()).filter(
      (count) => count > 0
    ).length;

    return {
      totalActiveDays,
      dailyActivity,
    };
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return {
      totalActiveDays: 0,
      dailyActivity: [],
    };
  }
}
