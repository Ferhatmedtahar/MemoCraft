export const getInitials = (name: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
