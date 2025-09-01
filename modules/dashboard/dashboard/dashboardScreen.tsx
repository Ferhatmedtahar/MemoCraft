"use client";
import { Card } from "@/components/ui/card";
import { themeConfigs, useTheme } from "@/contexts/theme-context";
import { Activity, BookOpen, TrendingUp, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ActivityStreakClient from "./features/activity/ActivityClient";
import InfosCards from "./features/components/InfosCards";
import Profile from "./features/components/Profile";

function getWeeklyData(notes: any[], atoms: any[], flashcards: any[]) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const notesCount = notes.filter(
      (note) => note.created_at && note.created_at.startsWith(dateStr)
    ).length;

    const atomsCount = atoms.filter(
      (atom) => atom.created_at && atom.created_at.startsWith(dateStr)
    ).length;

    const flashcardsCount = flashcards.filter(
      (flashcard) =>
        flashcard.created_at && flashcard.created_at.startsWith(dateStr)
    ).length;

    weeklyData.push({
      day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
      notes: notesCount,
      atoms: atomsCount,
      flashcards: flashcardsCount,
    });
  }

  return weeklyData;
}

function getMonthlyData(notes: any[], atoms: any[], flashcards: any[]) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();
  const monthlyData = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Create date strings for the entire month
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

    const notesCount = notes.filter(
      (note) => note.created_at && note.created_at.startsWith(monthStr)
    ).length;

    const atomsCount = atoms.filter(
      (atom) => atom.created_at && atom.created_at.startsWith(monthStr)
    ).length;

    const flashcardsCount = flashcards.filter(
      (flashcard) =>
        flashcard.created_at && flashcard.created_at.startsWith(monthStr)
    ).length;

    monthlyData.push({
      month: monthNames[month],
      year: year,
      notes: notesCount,
      atoms: atomsCount,
      flashcards: flashcardsCount,
    });
  }

  return monthlyData;
}

export default async function DashboardScreen({
  data,
  activityData,
}: {
  data: any;
  activityData: any;
}) {
  const { user, notes, atoms, flashcards } = data;
  const { theme } = useTheme();
  const themeColors = themeConfigs[theme as keyof typeof themeConfigs];
  const chartFirstColor = themeColors.chartFirst || "#8b5cf6";
  const chartsecondColor =
    themeConfigs[theme as keyof typeof themeConfigs]?.chartSecond || "#06b6d4";
  const chartThirdColor = "#10b981"; // Green color for flashcards

  // Process data for charts
  console.log(notes, atoms, flashcards);
  const weeklyData = getWeeklyData(notes, atoms, flashcards);
  const monthlyData = getMonthlyData(notes, atoms, flashcards);

  if (!data) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Card.Content className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">You are not logged in!</h3>
          <p className="text-muted-foreground mb-4">
            Please log in to view your dashboard.
          </p>
        </Card.Content>
      </Card>
    );
  }

  const pieData = [
    { name: "Notes", value: notes.length, color: chartFirstColor },
    { name: "Atoms", value: atoms.length, color: chartsecondColor },
    { name: "Flashcards", value: flashcards.length, color: chartThirdColor },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to your Dashboard
          </h1>
          <p className="text-muted-foreground ">
            Track your progress and manage your learning journey.
          </p>
        </div>
        <div className="bg-primary/10 p-3 ">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Status</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {notes.length + atoms.length + flashcards.length === 0
              ? "Ready to start your learning journey!"
              : `You're doing great! Keep building your knowledge base.`}
          </p>
        </div>
      </div>

      {/* Main Grid Layout - matches your wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Profile (spans 3 columns) */}
        <div className="lg:col-span-3 ">
          <Profile
            user={user}
            NumOfitems={notes.length + atoms.length + flashcards.length}
          />
        </div>

        {/* Right Column - Charts and Stats (spans 9 columns) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Row - Info Cards (3 cards in a row) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfosCards
              notes={notes.length}
              atoms={atoms.length}
              flashcards={flashcards.length}
            />
          </div>

          {/* Middle Row - Two Charts Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 - Weekly Activity Bar Chart */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  This Week&apos;s Activity
                </Card.Title>
                <Card.Description>
                  Notes, atoms, and flashcards created this week
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="notes"
                      fill="var(--color-chart-first)"
                      name="Notes"
                    />
                    <Bar
                      dataKey="atoms"
                      fill="var(--color-chart-second)"
                      name="Atoms"
                    />
                    <Bar
                      dataKey="flashcards"
                      fill={chartThirdColor}
                      name="Flashcards"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Content>
            </Card>

            {/* Chart 2 - Monthly Activity Bar Chart */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Activity
                </Card.Title>
                <Card.Description>
                  Notes, atoms, and flashcards created over the past 12 months
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const monthData = monthlyData.find(
                          (d) => d.month === label
                        );
                        return monthData ? `${label} ${monthData.year}` : label;
                      }}
                    />
                    <Bar
                      dataKey="notes"
                      fill="var(--color-chart-first)"
                      name="Notes"
                    />
                    <Bar
                      dataKey="atoms"
                      fill="var(--color-chart-second)"
                      name="Atoms"
                    />
                    <Bar
                      dataKey="flashcards"
                      fill={chartThirdColor}
                      name="Flashcards"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Content>
            </Card>
          </div>

          {/* Pie Chart Row */}
        </div>
      </div>

      {/* Bottom Full Width - Activity Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="grid-cols-1 lg:col-span-2">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Overview
            </Card.Title>
            <Card.Description>
              Your contribution activity over the past year
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ActivityStreakClient
              activityData={activityData}
              className="w-full"
            />
          </Card.Content>
        </Card>
        <div className="grid grid-cols-1 lg:col-span-2 gap-6">
          {/* Chart 3 - Pie Chart */}
          {pieData.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Content Distribution
                </Card.Title>
                <Card.Description>
                  Breakdown of your learning materials
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-col items-center gap-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, value, percent }) =>
                          `${name}: ${value} (${((percent || 0) * 100).toFixed(
                            1
                          )}%)`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 gap-2">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
