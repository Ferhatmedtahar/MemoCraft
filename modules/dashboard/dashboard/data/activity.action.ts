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

  // Get last 365 days for the activity map
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  try {
    // Fetch notes and atoms from the last year
    const [{ data: notesData }, { data: atomsData }] = await Promise.all([
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
    ]);

    // TODO: Add space for 2 more data sources here
    // const [{ data: flashcardsData }, { data: anotherData }] = await Promise.all([
    //   supabase.from("flashcards").select("created_at, updated_at").eq("user_id", userId),
    //   supabase.from("another_table").select("created_at, updated_at").eq("user_id", userId),
    // ]);

    // Create daily activity map
    const dailyActivityMap = new Map<string, number>();

    // Helper function to add activity for a date
    const addActivity = (dateString: string) => {
      if (!dateString) return;
      const date = new Date(dateString).toISOString().split("T")[0];
      dailyActivityMap.set(date, (dailyActivityMap.get(date) || 0) + 1);
    };

    // Process notes
    notesData?.forEach((note) => {
      addActivity(note.created_at);
      // Count updates as separate activities if different from creation
      if (note.updated_at && note.updated_at !== note.created_at) {
        addActivity(note.updated_at);
      }
    });

    // Process atoms
    atomsData?.forEach((atom) => {
      addActivity(atom.created_at);
      // Count updates as separate activities if different from creation
      if (atom.updated_at && atom.updated_at !== atom.created_at) {
        addActivity(atom.updated_at);
      }
    });

    // TODO: Process additional data sources
    // flashcardsData?.forEach((flashcard) => {
    //   addActivity(flashcard.created_at);
    //   if (flashcard.updated_at && flashcard.updated_at !== flashcard.created_at) {
    //     addActivity(flashcard.updated_at);
    //   }
    // });

    // Convert to array format for the last 365 days
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

    // Count total active days (days with at least 1 activity)
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
// "use server";

// import { createClientForServer } from "@/utils/supabase/server";

// export interface ActivityStats {
//   currentStreak: number;
//   longestStreak: number;
//   totalActiveDays: number;
//   thisWeek: number;
//   thisMonth: number;
//   last7Days: number[];
//   todayCount: number;
// }

// export async function generateSimpleActivityStats(): Promise<ActivityStats> {
//   const supabase = await createClientForServer();
//   const user = await supabase.auth.getUser();

//   if (!user.data.user) {
//     return {
//       currentStreak: 0,
//       longestStreak: 0,
//       totalActiveDays: 0,
//       thisWeek: 0,
//       thisMonth: 0,
//       last7Days: [0, 0, 0, 0, 0, 0, 0],
//       todayCount: 0,
//     };
//   }

//   const userId = user.data.user.id;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Calculate date ranges
//   const oneYearAgo = new Date(today);
//   oneYearAgo.setFullYear(today.getFullYear() - 1);

//   const thisWeekStart = new Date(today);
//   thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)

//   const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

//   const sevenDaysAgo = new Date(today);
//   sevenDaysAgo.setDate(today.getDate() - 6);

//   try {
//     // Fetch all activity data for the past year
//     const [{ data: notesData }, { data: atomsData }] = await Promise.all([
//       supabase
//         .from("notes")
//         .select("created_at, updated_at")
//         .eq("user_id", userId)
//         .gte("created_at", oneYearAgo.toISOString()),
//       supabase
//         .from("atoms")
//         .select("created_at, updated_at")
//         .eq("user_id", userId)
//         .gte("created_at", oneYearAgo.toISOString()),
//     ]);

//     // Create daily activity map
//     const dailyActivity = new Map<string, number>();

//     // Process notes
//     notesData?.forEach((note) => {
//       if (note.created_at) {
//         const date = new Date(note.created_at).toISOString().split("T")[0];
//         dailyActivity.set(date, (dailyActivity.get(date) || 0) + 1);
//       }
//       if (note.updated_at && note.updated_at !== note.created_at) {
//         const date = new Date(note.updated_at).toISOString().split("T")[0];
//         dailyActivity.set(date, (dailyActivity.get(date) || 0) + 1);
//       }
//     });

//     // Process atoms
//     atomsData?.forEach((atom) => {
//       if (atom.created_at) {
//         const date = new Date(atom.created_at).toISOString().split("T")[0];
//         dailyActivity.set(date, (dailyActivity.get(date) || 0) + 1);
//       }
//       if (atom.updated_at && atom.updated_at !== atom.created_at) {
//         const date = new Date(atom.updated_at).toISOString().split("T")[0];
//         dailyActivity.set(date, (dailyActivity.get(date) || 0) + 1);
//       }
//     });

//     // Calculate stats
//     const todayStr = today.toISOString().split("T")[0];
//     const todayCount = dailyActivity.get(todayStr) || 0;

//     // Calculate current streak
//     let currentStreak = 0;
//     const checkDate = new Date(today);
//     while (true) {
//       const dateStr = checkDate.toISOString().split("T")[0];
//       if (dailyActivity.has(dateStr) && dailyActivity.get(dateStr)! > 0) {
//         currentStreak++;
//         checkDate.setDate(checkDate.getDate() - 1);
//       } else {
//         break;
//       }
//     }

//     // Calculate longest streak
//     let longestStreak = 0;
//     let tempStreak = 0;

//     // Sort dates and check consecutive days
//     const sortedDates = Array.from(dailyActivity.keys()).sort();
//     let prevDate: Date | null = null;

//     for (const dateStr of sortedDates) {
//       if (dailyActivity.get(dateStr)! > 0) {
//         const currentDate = new Date(dateStr);

//         if (prevDate) {
//           const daysDiff =
//             (currentDate.getTime() - prevDate.getTime()) /
//             (1000 * 60 * 60 * 24);
//           if (daysDiff === 1) {
//             tempStreak++;
//           } else {
//             tempStreak = 1;
//           }
//         } else {
//           tempStreak = 1;
//         }

//         longestStreak = Math.max(longestStreak, tempStreak);
//         prevDate = currentDate;
//       }
//     }

//     // Count total active days
//     const totalActiveDays = Array.from(dailyActivity.values()).filter(
//       (count) => count > 0
//     ).length;

//     // Count this week's active days
//     let thisWeek = 0;
//     for (let i = 0; i < 7; i++) {
//       const checkDate = new Date(thisWeekStart);
//       checkDate.setDate(thisWeekStart.getDate() + i);
//       const dateStr = checkDate.toISOString().split("T")[0];
//       if (dailyActivity.has(dateStr) && dailyActivity.get(dateStr)! > 0) {
//         thisWeek++;
//       }
//     }

//     // Count this month's active days
//     let thisMonth = 0;
//     const daysInMonth = new Date(
//       today.getFullYear(),
//       today.getMonth() + 1,
//       0
//     ).getDate();
//     for (let day = 1; day <= daysInMonth; day++) {
//       const checkDate = new Date(today.getFullYear(), today.getMonth(), day);
//       if (checkDate <= today) {
//         const dateStr = checkDate.toISOString().split("T")[0];
//         if (dailyActivity.has(dateStr) && dailyActivity.get(dateStr)! > 0) {
//           thisMonth++;
//         }
//       }
//     }

//     // Get last 7 days activity counts
//     const last7Days = [];
//     for (let i = 6; i >= 0; i--) {
//       const checkDate = new Date(today);
//       checkDate.setDate(today.getDate() - i);
//       const dateStr = checkDate.toISOString().split("T")[0];
//       last7Days.push(dailyActivity.get(dateStr) || 0);
//     }

//     return {
//       currentStreak,
//       longestStreak,
//       totalActiveDays,
//       thisWeek,
//       thisMonth,
//       last7Days,
//       todayCount,
//     };
//   } catch (error) {
//     console.error("Error generating simple activity stats:", error);
//     return {
//       currentStreak: 0,
//       longestStreak: 0,
//       totalActiveDays: 0,
//       thisWeek: 0,
//       thisMonth: 0,
//       last7Days: [0, 0, 0, 0, 0, 0, 0],
//       todayCount: 0,
//     };
//   }
// }
// // "use server";

// // import { createClientForServer } from "@/utils/supabase/server";

// // export async function generateActivityStreakData() {
// //   const supabase = await createClientForServer();
// //   const user = await supabase.auth.getUser();

// //   if (!user.data.user) {
// //     return [];
// //   }

// //   const userId = user.data.user.id;

// //   // Calculate date range for last 365 days
// //   const today = new Date();
// //   const startDate = new Date(today);
// //   startDate.setDate(today.getDate() - 364);

// //   const startDateStr = startDate.toISOString();
// //   const endDateStr = today.toISOString();

// //   try {
// //     // Fetch notes with created_at and updated_at in the last 365 days
// //     const { data: notesData } = await supabase
// //       .from("notes")
// //       .select("created_at, updated_at")
// //       .eq("user_id", userId)
// //       .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// //       .lte("created_at", endDateStr);

// //     // Fetch atoms with created_at and updated_at in the last 365 days
// //     const { data: atomsData } = await supabase
// //       .from("atoms")
// //       .select("created_at, updated_at")
// //       .eq("user_id", userId)
// //       .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// //       .lte("created_at", endDateStr);

// //     // Create a map to count activities per day
// //     const activityMap = new Map<string, Set<string>>();

// //     // Process notes data
// //     notesData?.forEach((note) => {
// //       // Count created_at activity
// //       if (note.created_at) {
// //         const createdDate = new Date(note.created_at)
// //           .toISOString()
// //           .split("T")[0];
// //         if (!activityMap.has(createdDate)) {
// //           activityMap.set(createdDate, new Set());
// //         }
// //         activityMap.get(createdDate)!.add(`note_created_${note.created_at}`);
// //       }

// //       // Count updated_at activity (only if different from created_at)
// //       if (note.updated_at && note.updated_at !== note.created_at) {
// //         const updatedDate = new Date(note.updated_at)
// //           .toISOString()
// //           .split("T")[0];
// //         if (!activityMap.has(updatedDate)) {
// //           activityMap.set(updatedDate, new Set());
// //         }
// //         activityMap.get(updatedDate)!.add(`note_updated_${note.updated_at}`);
// //       }
// //     });

// //     // Process atoms data
// //     atomsData?.forEach((atom) => {
// //       // Count created_at activity
// //       if (atom.created_at) {
// //         const createdDate = new Date(atom.created_at)
// //           .toISOString()
// //           .split("T")[0];
// //         if (!activityMap.has(createdDate)) {
// //           activityMap.set(createdDate, new Set());
// //         }
// //         activityMap.get(createdDate)!.add(`atom_created_${atom.created_at}`);
// //       }

// //       // Count updated_at activity (only if different from created_at)
// //       if (atom.updated_at && atom.updated_at !== atom.created_at) {
// //         const updatedDate = new Date(atom.updated_at)
// //           .toISOString()
// //           .split("T")[0];
// //         if (!activityMap.has(updatedDate)) {
// //           activityMap.set(updatedDate, new Set());
// //         }
// //         activityMap.get(updatedDate)!.add(`atom_updated_${atom.updated_at}`);
// //       }
// //     });

// //     // Generate streak data for last 365 days
// //     const streakData = [];
// //     for (let i = 364; i >= 0; i--) {
// //       const date = new Date(today);
// //       date.setDate(today.getDate() - i);
// //       const dateStr = date.toISOString().split("T")[0];

// //       const dayActivities = activityMap.get(dateStr);
// //       const count = dayActivities ? dayActivities.size : 0;

// //       // Calculate activity level based on count
// //       let level = 0;
// //       if (count > 0) level = 1;
// //       if (count > 2) level = 2;
// //       if (count > 5) level = 3;
// //       if (count > 10) level = 4;

// //       streakData.push({
// //         date: dateStr,
// //         count,
// //         level,
// //       });
// //     }

// //     return streakData;
// //   } catch (error) {
// //     console.error("Error generating activity streak data:", error);
// //     return [];
// //   }
// // }

// // // Optional: More granular function that returns detailed activity breakdown
// // export async function generateDetailedActivityStreakData() {
// //   const supabase = await createClientForServer();
// //   const user = await supabase.auth.getUser();

// //   if (!user.data.user) {
// //     return [];
// //   }

// //   const userId = user.data.user.id;
// //   const today = new Date();
// //   const startDate = new Date(today);
// //   startDate.setDate(today.getDate() - 364);

// //   const startDateStr = startDate.toISOString();
// //   const endDateStr = today.toISOString();

// //   try {
// //     // Fetch notes and atoms data
// //     const [{ data: notesData }, { data: atomsData }] = await Promise.all([
// //       supabase
// //         .from("notes")
// //         .select("created_at, updated_at")
// //         .eq("user_id", userId)
// //         .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// //         .lte("created_at", endDateStr),
// //       supabase
// //         .from("atoms")
// //         .select("created_at, updated_at")
// //         .eq("user_id", userId)
// //         .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// //         .lte("created_at", endDateStr),
// //     ]);

// //     // Create detailed activity tracking
// //     const activityMap = new Map<
// //       string,
// //       {
// //         notesCreated: number;
// //         notesUpdated: number;
// //         atomsCreated: number;
// //         atomsUpdated: number;
// //         total: number;
// //       }
// //     >();

// //     // Initialize all days
// //     for (let i = 364; i >= 0; i--) {
// //       const date = new Date(today);
// //       date.setDate(today.getDate() - i);
// //       const dateStr = date.toISOString().split("T")[0];
// //       activityMap.set(dateStr, {
// //         notesCreated: 0,
// //         notesUpdated: 0,
// //         atomsCreated: 0,
// //         atomsUpdated: 0,
// //         total: 0,
// //       });
// //     }

// //     // Process notes
// //     notesData?.forEach((note) => {
// //       if (note.created_at) {
// //         const createdDate = new Date(note.created_at)
// //           .toISOString()
// //           .split("T")[0];
// //         const activity = activityMap.get(createdDate);
// //         if (activity) {
// //           activity.notesCreated++;
// //           activity.total++;
// //         }
// //       }

// //       if (note.updated_at && note.updated_at !== note.created_at) {
// //         const updatedDate = new Date(note.updated_at)
// //           .toISOString()
// //           .split("T")[0];
// //         const activity = activityMap.get(updatedDate);
// //         if (activity) {
// //           activity.notesUpdated++;
// //           activity.total++;
// //         }
// //       }
// //     });

// //     // Process atoms
// //     atomsData?.forEach((atom) => {
// //       if (atom.created_at) {
// //         const createdDate = new Date(atom.created_at)
// //           .toISOString()
// //           .split("T")[0];
// //         const activity = activityMap.get(createdDate);
// //         if (activity) {
// //           activity.atomsCreated++;
// //           activity.total++;
// //         }
// //       }

// //       if (atom.updated_at && atom.updated_at !== atom.created_at) {
// //         const updatedDate = new Date(atom.updated_at)
// //           .toISOString()
// //           .split("T")[0];
// //         const activity = activityMap.get(updatedDate);
// //         if (activity) {
// //           activity.atomsUpdated++;
// //           activity.total++;
// //         }
// //       }
// //     });

// //     // Generate detailed streak data
// //     const streakData = Array.from(activityMap.entries()).map(
// //       ([date, activity]) => {
// //         let level = 0;
// //         if (activity.total > 0) level = 1;
// //         if (activity.total > 2) level = 2;
// //         if (activity.total > 5) level = 3;
// //         if (activity.total > 10) level = 4;

// //         return {
// //           date,
// //           count: activity.total,
// //           level,
// //           breakdown: {
// //             notesCreated: activity.notesCreated,
// //             notesUpdated: activity.notesUpdated,
// //             atomsCreated: activity.atomsCreated,
// //             atomsUpdated: activity.atomsUpdated,
// //           },
// //         };
// //       }
// //     );

// //     return streakData.sort(
// //       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
// //     );
// //   } catch (error) {
// //     console.error("Error generating detailed activity streak data:", error);
// //     return [];
// //   }
// // }
// // // "use server";

// // // import { createClientForServer } from "@/utils/supabase/server";

// // // export async function generateActivityStreakData() {
// // //   const supabase = await createClientForServer();
// // //   const user = await supabase.auth.getUser();

// // //   if (!user.data.user) {
// // //     return [];
// // //   }

// // //   const userId = user.data.user.id;

// // //   // Calculate date range for last 365 days
// // //   const today = new Date();
// // //   const startDate = new Date(today);
// // //   startDate.setDate(today.getDate() - 364);

// // //   const startDateStr = startDate.toISOString();
// // //   const endDateStr = today.toISOString();

// // //   try {
// // //     // Fetch notes with created_at and updated_at in the last 365 days
// // //     const { data: notesData } = await supabase
// // //       .from("notes")
// // //       .select("created_at, updated_at")
// // //       .eq("user_id", userId)
// // //       .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// // //       .lte("created_at", endDateStr);

// // //     // Fetch atoms with created_at and updated_at in the last 365 days
// // //     const { data: atomsData } = await supabase
// // //       .from("atoms")
// // //       .select("created_at, updated_at")
// // //       .eq("user_id", userId)
// // //       .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// // //       .lte("created_at", endDateStr);

// // //     // Create a map to count activities per day
// // //     const activityMap = new Map<string, Set<string>>();

// // //     // Process notes data
// // //     notesData?.forEach((note) => {
// // //       // Count created_at activity
// // //       if (note.created_at) {
// // //         const createdDate = new Date(note.created_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         if (!activityMap.has(createdDate)) {
// // //           activityMap.set(createdDate, new Set());
// // //         }
// // //         activityMap.get(createdDate)!.add(`note_created_${note.created_at}`);
// // //       }

// // //       // Count updated_at activity (only if different from created_at)
// // //       if (note.updated_at && note.updated_at !== note.created_at) {
// // //         const updatedDate = new Date(note.updated_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         if (!activityMap.has(updatedDate)) {
// // //           activityMap.set(updatedDate, new Set());
// // //         }
// // //         activityMap.get(updatedDate)!.add(`note_updated_${note.updated_at}`);
// // //       }
// // //     });

// // //     // Process atoms data
// // //     atomsData?.forEach((atom) => {
// // //       // Count created_at activity
// // //       if (atom.created_at) {
// // //         const createdDate = new Date(atom.created_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         if (!activityMap.has(createdDate)) {
// // //           activityMap.set(createdDate, new Set());
// // //         }
// // //         activityMap.get(createdDate)!.add(`atom_created_${atom.created_at}`);
// // //       }

// // //       // Count updated_at activity (only if different from created_at)
// // //       if (atom.updated_at && atom.updated_at !== atom.created_at) {
// // //         const updatedDate = new Date(atom.updated_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         if (!activityMap.has(updatedDate)) {
// // //           activityMap.set(updatedDate, new Set());
// // //         }
// // //         activityMap.get(updatedDate)!.add(`atom_updated_${atom.updated_at}`);
// // //       }
// // //     });

// // //     // Generate streak data for last 365 days
// // //     const streakData = [];
// // //     for (let i = 364; i >= 0; i--) {
// // //       const date = new Date(today);
// // //       date.setDate(today.getDate() - i);
// // //       const dateStr = date.toISOString().split("T")[0];

// // //       const dayActivities = activityMap.get(dateStr);
// // //       const count = dayActivities ? dayActivities.size : 0;

// // //       // Calculate activity level based on count
// // //       let level = 0;
// // //       if (count > 0) level = 1;
// // //       if (count > 2) level = 2;
// // //       if (count > 5) level = 3;
// // //       if (count > 10) level = 4;

// // //       streakData.push({
// // //         date: dateStr,
// // //         count,
// // //         level,
// // //       });
// // //     }

// // //     return streakData;
// // //   } catch (error) {
// // //     console.error("Error generating activity streak data:", error);
// // //     return [];
// // //   }
// // // }

// // // // Optional: More granular function that returns detailed activity breakdown
// // // export async function generateDetailedActivityStreakData() {
// // //   const supabase = await createClientForServer();
// // //   const user = await supabase.auth.getUser();

// // //   if (!user.data.user) {
// // //     return [];
// // //   }

// // //   const userId = user.data.user.id;
// // //   const today = new Date();
// // //   const startDate = new Date(today);
// // //   startDate.setDate(today.getDate() - 364);

// // //   const startDateStr = startDate.toISOString();
// // //   const endDateStr = today.toISOString();

// // //   try {
// // //     // Fetch notes and atoms data
// // //     const [{ data: notesData }, { data: atomsData }] = await Promise.all([
// // //       supabase
// // //         .from("notes")
// // //         .select("created_at, updated_at")
// // //         .eq("user_id", userId)
// // //         .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// // //         .lte("created_at", endDateStr),
// // //       supabase
// // //         .from("atoms")
// // //         .select("created_at, updated_at")
// // //         .eq("user_id", userId)
// // //         .or(`created_at.gte.${startDateStr},updated_at.gte.${startDateStr}`)
// // //         .lte("created_at", endDateStr),
// // //     ]);

// // //     // Create detailed activity tracking
// // //     const activityMap = new Map<
// // //       string,
// // //       {
// // //         notesCreated: number;
// // //         notesUpdated: number;
// // //         atomsCreated: number;
// // //         atomsUpdated: number;
// // //         total: number;
// // //       }
// // //     >();

// // //     // Initialize all days
// // //     for (let i = 364; i >= 0; i--) {
// // //       const date = new Date(today);
// // //       date.setDate(today.getDate() - i);
// // //       const dateStr = date.toISOString().split("T")[0];
// // //       activityMap.set(dateStr, {
// // //         notesCreated: 0,
// // //         notesUpdated: 0,
// // //         atomsCreated: 0,
// // //         atomsUpdated: 0,
// // //         total: 0,
// // //       });
// // //     }

// // //     // Process notes
// // //     notesData?.forEach((note) => {
// // //       if (note.created_at) {
// // //         const createdDate = new Date(note.created_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         const activity = activityMap.get(createdDate);
// // //         if (activity) {
// // //           activity.notesCreated++;
// // //           activity.total++;
// // //         }
// // //       }

// // //       if (note.updated_at && note.updated_at !== note.created_at) {
// // //         const updatedDate = new Date(note.updated_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         const activity = activityMap.get(updatedDate);
// // //         if (activity) {
// // //           activity.notesUpdated++;
// // //           activity.total++;
// // //         }
// // //       }
// // //     });

// // //     // Process atoms
// // //     atomsData?.forEach((atom) => {
// // //       if (atom.created_at) {
// // //         const createdDate = new Date(atom.created_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         const activity = activityMap.get(createdDate);
// // //         if (activity) {
// // //           activity.atomsCreated++;
// // //           activity.total++;
// // //         }
// // //       }

// // //       if (atom.updated_at && atom.updated_at !== atom.created_at) {
// // //         const updatedDate = new Date(atom.updated_at)
// // //           .toISOString()
// // //           .split("T")[0];
// // //         const activity = activityMap.get(updatedDate);
// // //         if (activity) {
// // //           activity.atomsUpdated++;
// // //           activity.total++;
// // //         }
// // //       }
// // //     });

// // //     // Generate detailed streak data
// // //     const streakData = Array.from(activityMap.entries()).map(
// // //       ([date, activity]) => {
// // //         let level = 0;
// // //         if (activity.total > 0) level = 1;
// // //         if (activity.total > 2) level = 2;
// // //         if (activity.total > 5) level = 3;
// // //         if (activity.total > 10) level = 4;

// // //         return {
// // //           date,
// // //           count: activity.total,
// // //           level,
// // //           breakdown: {
// // //             notesCreated: activity.notesCreated,
// // //             notesUpdated: activity.notesUpdated,
// // //             atomsCreated: activity.atomsCreated,
// // //             atomsUpdated: activity.atomsUpdated,
// // //           },
// // //         };
// // //       }
// // //     );

// // //     return streakData.sort(
// // //       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
// // //     );
// // //   } catch (error) {
// // //     console.error("Error generating detailed activity streak data:", error);
// // //     return [];
// // //   }
// // // }
