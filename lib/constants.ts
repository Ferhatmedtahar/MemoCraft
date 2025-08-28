export const themeOptions = [
  {
    value: "white" as const,
    label: "Clean White",
    color: "bg-gray-100 border border-gray-300",
  },
  {
    value: "slate" as const,
    label: "Professional Slate",
    color: "bg-slate-500",
  },
  { value: "blue" as const, label: "Ocean Blue", color: "bg-blue-500" },
  { value: "pink" as const, label: "Bubblegum Pink", color: "bg-pink-500" },
  { value: "green" as const, label: "Forest Green", color: "bg-green-500" },
  { value: "purple" as const, label: "Royal Purple", color: "bg-purple-400" },
  {
    value: "orange" as const,
    label: "Sunset Orange",
    color: "bg-orange-500",
  },

  { value: "teal" as const, label: "Ocean Teal", color: "bg-teal-500" },
  { value: "amber" as const, label: "Golden Amber", color: "bg-amber-500" },
  { value: "crimson" as const, label: "Deep Crimson", color: "bg-red-600" },
  {
    value: "emerald" as const,
    label: "Emerald Green",
    color: "bg-emerald-500",
  },
  { value: "dark" as const, label: "Midnight Dark", color: "bg-gray-800" },
  { value: "cyber" as const, label: "Cyber Purple", color: "bg-purple-700" },
  { value: "matrix" as const, label: "Matrix Green", color: "bg-green-600" },
];

export type ThemeOptionsType = {
  value: string;
  label: string;
  color: string;
};
