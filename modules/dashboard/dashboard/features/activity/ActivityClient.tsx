"use client";

import { Card } from "@/components/ui/card";
import { Activity, Calendar, Flame } from "lucide-react";
interface SimpleActivityBoxesProps {
  activityData: {
    dailyActivity: { date: string; count: number }[];
    totalActiveDays: number;
  };
  className?: string;
}

export default function SimpleActivityBoxes({
  activityData,
  className,
}: SimpleActivityBoxesProps) {
  // Calculate total activities
  const totalActivities = activityData.dailyActivity.reduce(
    (sum, day) => sum + day.count,
    0
  );

  // Calculate longest streak of consecutive days with activity
  let longestStreak = 0;
  let currentStreak = 0;

  for (const day of activityData.dailyActivity) {
    if (day.count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  // Calculate current streak (from the most recent day backwards)
  let currentActiveStreak = 0;
  for (let i = activityData.dailyActivity.length - 1; i >= 0; i--) {
    if (activityData.dailyActivity[i].count > 0) {
      currentActiveStreak++;
    } else {
      break;
    }
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {/* Total Active Days */}
      <Card>
        <Card.Content className="p-6">
          <div
            className="  shadow-[var(--theme-shadow)]  hover:shadow-none  text-primary-foreground border-2 border-foreground  transition-all outline-hidden cursor-pointer duration-200  hover:translate-y-1   w-12 h-12 bg-blue-500/10  flex items-center justify-center mb-4 "

            // className="w-12 h-12 bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center mb-4 "
          >
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-1">
            {activityData.totalActiveDays}
          </h4>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Total Active Days
          </p>
          <p className="text-xs text-muted-foreground">
            Days with at least one activity
          </p>
        </Card.Content>
      </Card>

      {/* Total Activities */}
      <Card>
        <Card.Content className="p-6">
          <div
            // className="w-12 h-12 bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center mb-4 "
            className="shadow-[var(--theme-shadow)]  hover:shadow-none  text-primary-foreground border-2 border-foreground  transition-all outline-hidden cursor-pointer duration-200  hover:translate-y-1  w-12 h-12 bg-green-500/10  flex items-center justify-center mb-4 "
          >
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-1">
            {totalActivities}
          </h4>
          <p className="text-sm font-medium text-green-600 mb-1">
            Total Activities
          </p>
          <p className="text-xs text-muted-foreground">
            All recorded activities combined
          </p>
        </Card.Content>
      </Card>

      {/* Longest Streak */}
      <Card>
        <Card.Content className="p-6">
          <div className="shadow-[var(--theme-shadow)]  hover:shadow-none  text-primary-foreground border-2 border-foreground  transition-all outline-hidden cursor-pointer duration-200  hover:translate-y-1   w-12 h-12 bg-orange-500/10  flex items-center justify-center mb-4 ">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-1">
            {longestStreak}
          </h4>
          <p className="text-sm font-medium text-orange-600 mb-1">
            Longest Streak
          </p>
          <p className="text-xs text-muted-foreground">
            {currentActiveStreak > 0
              ? `Current: ${currentActiveStreak} day${
                  currentActiveStreak !== 1 ? "s" : ""
                }`
              : "Consecutive active days"}
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
