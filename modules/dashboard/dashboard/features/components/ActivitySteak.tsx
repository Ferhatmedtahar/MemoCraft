// import { Flame, Trophy } from "lucide-react";
// import { generateSimpleActivityStats } from "../../data/activity.action";

// export default async function SimpleActivityTracker() {
//   const stats = await generateSimpleActivityStats();

//   const getStreakEmoji = (streak: number) => {
//     if (streak === 0) return "💤";
//     if (streak < 3) return "🔥";
//     if (streak < 7) return "🚀";
//     if (streak < 14) return "⭐";
//     return "🏆";
//   };

//   const getEncouragement = (streak: number) => {
//     if (streak === 0) return "Start your streak today!";
//     if (streak < 3) return "Keep the momentum going!";
//     if (streak < 7) return "You're on fire!";
//     if (streak < 14) return "Incredible consistency!";
//     return "You're absolutely crushing it!";
//   };

//   return (
//     <div className="space-y-6">
//       {/* Main Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Current Streak - Most Prominent */}
//         <div className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-orange-500 text-white rounded-lg">
//               <Flame className="w-5 h-5" />
//             </div>
//             <h3 className="text-lg font-semibold">Current Streak</h3>
//           </div>

//           <div className="text-center">
//             <div className="text-6xl mb-2">
//               {getStreakEmoji(stats.currentStreak)}
//             </div>
//             <div className="text-4xl font-bold text-orange-500 mb-2">
//               {stats.currentStreak}
//             </div>
//             <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//               {stats.currentStreak === 1 ? "day" : "days"} in a row
//             </div>
//             <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
//               {getEncouragement(stats.currentStreak)}
//             </div>
//           </div>
//         </div>

//         {/* Personal Records */}
//         <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-purple-500 text-white rounded-lg">
//               <Trophy className="w-5 h-5" />
//             </div>
//             <h3 className="text-lg font-semibold">Records</h3>
//           </div>

//           <div className="space-y-4">
//             <div className="text-center">
//               <div className="text-2xl font-semibold text-purple-600">
//                 {stats.longestStreak}
//               </div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 longest streak
//               </div>
//             </div>

//             <div className="text-center">
//               <div className="text-2xl font-semibold text-green-600">
//                 {stats.totalActiveDays}
//               </div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 total active days
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-center">
//           <div className="text-2xl font-semibold text-green-600">
//             {stats.todayCount}
//           </div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             Today's Activities
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-center">
//           <div className="text-2xl font-semibold text-blue-600">
//             {stats.thisMonth}
//           </div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             This Month
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-center">
//           <div className="text-2xl font-semibold text-orange-600">
//             {Math.round((stats.thisWeek / 7) * 100)}%
//           </div>
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             Week Progress
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // import { Flame, Trophy } from "lucide-react";
// // import { useEffect, useState } from "react";

// // // Import your server action
// // import {
// //   ActivityStats,
// //   generateSimpleActivityStats,
// // } from "../../data/activity.action";

// // // Mock function for demo - replace with actual import
// // // const generateSimpleActivityStats = async () => ({
// // //   currentStreak: 5,
// // //   longestStreak: 12,
// // //   totalActiveDays: 87,
// // //   thisWeek: 4,
// // //   thisMonth: 18,
// // //   last7Days: [3, 0, 2, 1, 4, 0, 2],
// // //   todayCount: 2,
// // // });

// // // interface ActivityStats {
// // //   currentStreak: number;
// // //   longestStreak: number;
// // //   totalActiveDays: number;
// // //   thisWeek: number;
// // //   thisMonth: number;
// // //   last7Days: number[];
// // //   todayCount: number;
// // // }

// // export default function SimpleActivityTracker() {
// //   const [stats, setStats] = useState<ActivityStats | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     async function loadStats() {
// //       try {
// //         const data = await generateSimpleActivityStats();
// //         setStats(data);
// //       } catch (error) {
// //         console.error("Error loading activity stats:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     loadStats();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {[1, 2, 3].map((i) => (
// //           <div
// //             key={i}
// //             className="bg-white dark:bg-gray-900 p-6 rounded-xl border animate-pulse"
// //           >
// //             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
// //             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
// //             <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   }

// //   if (!stats) {
// //     return (
// //       <div className="text-center py-8">
// //         <div className="text-gray-500">Failed to load activity data</div>
// //       </div>
// //     );
// //   }

// //   const getStreakEmoji = (streak: number) => {
// //     if (streak === 0) return "💤";
// //     if (streak < 3) return "🔥";
// //     if (streak < 7) return "🚀";
// //     if (streak < 14) return "⭐";
// //     return "🏆";
// //   };

// //   const getEncouragement = (streak: number) => {
// //     if (streak === 0) return "Start your streak today!";
// //     if (streak < 3) return "Keep the momentum going!";
// //     if (streak < 7) return "You're on fire!";
// //     if (streak < 14) return "Incredible consistency!";
// //     return "You're absolutely crushing it!";
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Main Stats Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         {/* Current Streak - Most Prominent */}
// //         <div className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border">
// //           <div className="flex items-center gap-3 mb-4">
// //             <div className="p-2 bg-orange-500 text-white rounded-lg">
// //               <Flame className="w-5 h-5" />
// //             </div>
// //             <h3 className="text-lg font-semibold">Current Streak</h3>
// //           </div>

// //           <div className="text-center">
// //             <div className="text-6xl mb-2">
// //               {getStreakEmoji(stats.currentStreak)}
// //             </div>
// //             <div className="text-4xl font-bold text-orange-500 mb-2">
// //               {stats.currentStreak}
// //             </div>
// //             <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
// //               {stats.currentStreak === 1 ? "day" : "days"} in a row
// //             </div>
// //             <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
// //               {getEncouragement(stats.currentStreak)}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Personal Records */}
// //         <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border">
// //           <div className="flex items-center gap-3 mb-4">
// //             <div className="p-2 bg-purple-500 text-white rounded-lg">
// //               <Trophy className="w-5 h-5" />
// //             </div>
// //             <h3 className="text-lg font-semibold">Records</h3>
// //           </div>

// //           <div className="space-y-4">
// //             <div className="text-center">
// //               <div className="text-2xl font-semibold text-purple-600">
// //                 {stats.longestStreak}
// //               </div>
// //               <div className="text-sm text-gray-600 dark:text-gray-400">
// //                 longest streak
// //               </div>
// //             </div>

// //             <div className="text-center">
// //               <div className="text-2xl font-semibold text-green-600">
// //                 {stats.totalActiveDays}
// //               </div>
// //               <div className="text-sm text-gray-600 dark:text-gray-400">
// //                 total active days
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Secondary Stats */}
// //       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //         <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-center">
// //           <div className="text-2xl font-semibold text-green-600">
// //             {stats.todayCount}
// //           </div>
// //           <div className="text-sm text-gray-600 dark:text-gray-400">
// //             Today's Activities
// //           </div>
// //         </div>

// //         <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-center">
// //           <div className="text-2xl font-semibold text-blue-600">
// //             {stats.thisMonth}
// //           </div>
// //           <div className="text-sm text-gray-600 dark:text-gray-400">
// //             This Month
// //           </div>
// //         </div>

// //         <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border text-center">
// //           <div className="text-2xl font-semibold text-orange-600">
// //             {Math.round((stats.thisWeek / 7) * 100)}%
// //           </div>
// //           <div className="text-sm text-gray-600 dark:text-gray-400">
// //             Week Progress
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // // "use client";
// // // import { useEffect, useState } from "react";
// // // import { generateActivityStreakData } from "../../data/activity.action";

// // // interface ActivityData {
// // //   date: string;
// // //   count: number;
// // //   level: number;
// // // }

// // // export default function ActivitySteak() {
// // //   const [data, setData] = useState<ActivityData[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     async function loadActivityData() {
// // //       try {
// // //         setLoading(true);
// // //         const activityData = await generateActivityStreakData();
// // //         setData(activityData);
// // //       } catch (error) {
// // //         console.error("Error loading activity data:", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }

// // //     loadActivityData();
// // //   }, []);

// // //   if (loading) {
// // //     return (
// // //       <div className="space-y-4">
// // //         <div className="flex items-center justify-between">
// // //           <h3 className="text-lg font-semibold">Activity Streak</h3>
// // //         </div>
// // //         <div className="flex items-center justify-center h-24">
// // //           <div className="text-muted-foreground">Loading activity data...</div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const weeks = [];
// // //   for (let i = 0; i < data.length; i += 7) {
// // //     weeks.push(data.slice(i, i + 7));
// // //   }

// // //   const getColor = (level: number) => {
// // //     switch (level) {
// // //       case 0:
// // //         return "bg-gray-100 dark:bg-gray-800";
// // //       case 1:
// // //         return "bg-primary/20";
// // //       case 2:
// // //         return "bg-primary/40";
// // //       case 3:
// // //         return "bg-primary/60";
// // //       case 4:
// // //         return "bg-primary/80";
// // //       default:
// // //         return "bg-gray-100 dark:bg-gray-800";
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       <div className="flex items-center justify-between">
// // //         <h3 className="text-lg font-semibold">Activity Streak</h3>
// // //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // //           <span>Less</span>
// // //           <div className="flex gap-1">
// // //             {[0, 1, 2, 3, 4].map((level) => (
// // //               <div
// // //                 key={level}
// // //                 className={`w-3 h-3 rounded-sm ${getColor(level)}`}
// // //               />
// // //             ))}
// // //           </div>
// // //           <span>More</span>
// // //         </div>
// // //       </div>

// // //       <div className="flex gap-1 overflow-x-auto">
// // //         {weeks.map((week, weekIndex) => (
// // //           <div key={weekIndex} className="flex flex-col gap-1">
// // //             {week.map((day: ActivityData, dayIndex: number) => (
// // //               <div
// // //                 key={dayIndex}
// // //                 className={`w-3 h-3 rounded-sm ${getColor(
// // //                   day.level
// // //                 )} cursor-pointer hover:opacity-80`}
// // //                 title={`${day.date}: ${day.count} activities`}
// // //               />
// // //             ))}
// // //           </div>
// // //         ))}
// // //       </div>

// // //       <div className="flex justify-between text-xs text-muted-foreground">
// // //         <span>Jan</span>
// // //         <span>Feb</span>
// // //         <span>Mar</span>
// // //         <span>Apr</span>
// // //         <span>May</span>
// // //         <span>Jun</span>
// // //         <span>Jul</span>
// // //         <span>Aug</span>
// // //         <span>Sep</span>
// // //         <span>Oct</span>
// // //         <span>Nov</span>
// // //         <span>Dec</span>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // // "use client";
// // // // import { useEffect, useState } from "react";
// // // // import { generateActivityStreakData } from "../../data/activity.action"; // Update this path

// // // // interface ActivityData {
// // // //   date: string;
// // // //   count: number;
// // // //   level: number;
// // // // }

// // // // export default function ActivitySteak() {
// // // //   const [data, setData] = useState<ActivityData[]>([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     async function loadActivityData() {
// // // //       try {
// // // //         setLoading(true);
// // // //         const activityData = await generateActivityStreakData();
// // // //         setData(activityData);
// // // //       } catch (error) {
// // // //         console.error("Error loading activity data:", error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     }

// // // //     loadActivityData();
// // // //   }, []);

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="space-y-4">
// // // //         <div className="flex items-center justify-between">
// // // //           <h3 className="text-lg font-semibold">Activity Streak</h3>
// // // //         </div>
// // // //         <div className="flex items-center justify-center h-24">
// // // //           <div className="text-muted-foreground">Loading activity data...</div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const weeks = [];
// // // //   for (let i = 0; i < data.length; i += 7) {
// // // //     weeks.push(data.slice(i, i + 7));
// // // //   }

// // // //   const getColor = (level: number) => {
// // // //     switch (level) {
// // // //       case 0:
// // // //         return "bg-gray-100 dark:bg-gray-800";
// // // //       case 1:
// // // //         return "bg-primary/20";
// // // //       case 2:
// // // //         return "bg-primary/40";
// // // //       case 3:
// // // //         return "bg-primary/60";
// // // //       case 4:
// // // //         return "bg-primary/80";
// // // //       default:
// // // //         return "bg-gray-100 dark:bg-gray-800";
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       <div className="flex items-center justify-between">
// // // //         <h3 className="text-lg font-semibold">Activity Streak</h3>
// // // //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // // //           <span>Less</span>
// // // //           <div className="flex gap-1">
// // // //             {[0, 1, 2, 3, 4].map((level) => (
// // // //               <div
// // // //                 key={level}
// // // //                 className={`w-3 h-3 rounded-sm ${getColor(level)}`}
// // // //               />
// // // //             ))}
// // // //           </div>
// // // //           <span>More</span>
// // // //         </div>
// // // //       </div>

// // // //       <div className="flex gap-1 overflow-x-auto">
// // // //         {weeks.map((week, weekIndex) => (
// // // //           <div key={weekIndex} className="flex flex-col gap-1">
// // // //             {week.map((day: ActivityData, dayIndex: number) => (
// // // //               <div
// // // //                 key={dayIndex}
// // // //                 className={`w-3 h-3 rounded-sm ${getColor(
// // // //                   day.level
// // // //                 )} cursor-pointer hover:opacity-80`}
// // // //                 title={`${day.date}: ${day.count} activities`}
// // // //               />
// // // //             ))}
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       <div className="flex justify-between text-xs text-muted-foreground">
// // // //         <span>Jan</span>
// // // //         <span>Feb</span>
// // // //         <span>Mar</span>
// // // //         <span>Apr</span>
// // // //         <span>May</span>
// // // //         <span>Jun</span>
// // // //         <span>Jul</span>
// // // //         <span>Aug</span>
// // // //         <span>Sep</span>
// // // //         <span>Oct</span>
// // // //         <span>Nov</span>
// // // //         <span>Dec</span>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // // // function ActivitySteak({ data }: { data: any[] }) {
// // // // //   console.log(data);
// // // // //   const weeks = [];
// // // // //   for (let i = 0; i < data.length; i += 7) {
// // // // //     weeks.push(data.slice(i, i + 7));
// // // // //   }

// // // // //   const getColor = (level: number) => {
// // // // //     switch (level) {
// // // // //       case 0:
// // // // //         return "bg-gray-100 dark:bg-gray-800";
// // // // //       case 1:
// // // // //         return "bg-primary/20";
// // // // //       case 2:
// // // // //         return "bg-primary/40";
// // // // //       case 3:
// // // // //         return "bg-primary/60";
// // // // //       case 4:
// // // // //         return "bg-primary/80";
// // // // //       default:
// // // // //         return "bg-gray-100 dark:bg-gray-800";
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       <div className="flex items-center justify-between">
// // // // //         <h3 className="text-lg font-semibold">Activity Streak</h3>
// // // // //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // // // //           <span>Less</span>
// // // // //           <div className="flex gap-1">
// // // // //             {[0, 1, 2, 3, 4].map((level) => (
// // // // //               <div
// // // // //                 key={level}
// // // // //                 className={`w-3 h-3 rounded-sm ${getColor(level)}`}
// // // // //               />
// // // // //             ))}
// // // // //           </div>
// // // // //           <span>More</span>
// // // // //         </div>
// // // // //       </div>

// // // // //       <div className="flex gap-1 overflow-x-auto">
// // // // //         {weeks.map((week, weekIndex) => (
// // // // //           <div key={weekIndex} className="flex flex-col gap-1">
// // // // //             {week.map((day: any, dayIndex: number) => (
// // // // //               <div
// // // // //                 key={dayIndex}
// // // // //                 className={`w-3 h-3 rounded-sm ${getColor(
// // // // //                   day.level
// // // // //                 )} cursor-pointer`}
// // // // //                 title={`${day.date}: ${day.count} contributions`}
// // // // //               />
// // // // //             ))}
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>

// // // // //       <div className="flex justify-between text-xs text-muted-foreground">
// // // // //         <span>Jan</span>
// // // // //         <span>Feb</span>
// // // // //         <span>Mar</span>
// // // // //         <span>Apr</span>
// // // // //         <span>May</span>
// // // // //         <span>Jun</span>
// // // // //         <span>Jul</span>
// // // // //         <span>Aug</span>
// // // // //         <span>Sep</span>
// // // // //         <span>Oct</span>
// // // // //         <span>Nov</span>
// // // // //         <span>Dec</span>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default ActivitySteak;
